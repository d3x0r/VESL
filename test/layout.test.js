// node test/layout.test.js
// Exercises the layout pass and the tiler without three.js.

const assert = require( "assert" );
const { defs, instance } = require( "../layout/blockdef.js" );
const { layoutBlock, metrics, walk } = require( "../layout/layout.js" );
const { tileBlock, validate } = require( "../layout/tiler.js" );
const { render } = require( "../layout/svg.js" );

let passed = 0;
function test( name, fn ) {
	try { fn(); passed++; }
	catch( e ) { console.error( "FAIL", name ); console.error( e.stack || e ); process.exitCode = 1; }
}
const near = ( a, b, msg )=> assert( Math.abs( a - b ) < 1e-9, ( msg || '' ) + " expected " + b + " got " + a );

const call = ( f, args )=> instance( 'call', { fields:{ callee:f }, sections:{ args: ( args || [] ).map( k=>( { fields:{ key:k } } ) ) } } );
const value = ( t )=> instance( 'value', { fields:{ text:t } } );

// ---- rows never overlap and tile the block top to bottom -----------------
function checkRows( node ) {
	let y = 0;
	for( const r of node.rows ) {
		near( r.y, y, node.kind + " row " + r.type + " starts where the previous ended" );
		y += r.h;
	}
	near( y, node.h, node.kind + " rows sum to the block height" );
	for( const c of node.children ) checkRows( c.node );
}

test( "every kind lays out empty and tiles to a valid shape", ()=>{
	for( const kind in defs ) {
		const node = layoutBlock( instance( kind ) );
		checkRows( node );
		assert( node.w > 0 && node.h > 0 );
		const problems = validate( tileBlock( node ) );
		assert.deepEqual( problems, [], kind + ": " + problems.join( ", " ) );
	}
} );

test( "a statement with no body is a single compact row", ()=>{
	const node = layoutBlock( instance( 'assign', { fields:{ target:'x' } } ) );
	assert( node.compact );
	near( node.h, metrics.rowH );
	const conns = node.connectors.map( c=>c.name ).sort();
	assert.deepEqual( conns, [ 'bottom', 'top', 'value' ] );
} );

test( "a call with arguments grows a row per argument", ()=>{
	const a = layoutBlock( call( 'f' ) );
	const b = layoutBlock( call( 'f', [ 'x' ] ) );
	const c = layoutBlock( call( 'f', [ 'x', 'y' ] ) );
	assert( a.compact );
	near( c.h - b.h, metrics.rowH, "one more input row" );
} );

test( "statements hanging from a fork stack with their own heights", ()=>{
	const sw = instance( 'switch', { sections:{ cases:[ { statements:[ call( 'a', [ 'x' ] ), call( 'b' ) ] } ] } } );
	const node = layoutBlock( sw );
	const fork = node.rows.find( r=>r.type === 'fork' );
	const kids = node.children.filter( c=>c.via.name === 'cases' );
	assert.equal( kids.length, 2 );
	near( kids[0].y, fork.y + metrics.rowH, "first statement starts under the fork tab" );
	near( kids[1].y, kids[0].y + kids[0].node.stackH, "second statement starts where the first ends" );
	near( kids[0].x, metrics.barW, "statements sit just right of the bar" );
	near( fork.h, metrics.rowH + kids[0].node.stackH + kids[1].node.stackH + metrics.htabH + metrics.forkGap );
} );

test( "a compact statement stays one row when a tall value is plugged in, but stacks below it", ()=>{
	const obj = instance( 'object', { sections:{ fields:[ { fields:{ key:'p' } }, { fields:{ key:'q' } } ] } } );
	const ret = layoutBlock( instance( 'return', { inputs:{ value:obj } } ) );
	assert( ret.compact );
	near( ret.h, metrics.rowH );
	near( ret.stackH, layoutBlock( obj ).h );
	const fn = layoutBlock( instance( 'function', { sections:{ body:[ { statements:[ instance( 'return', { inputs:{ value:obj } } ), call( 'after' ) ] } ] } } ) );
	const kids = fn.children.filter( c=>c.via.name === 'body' );
	near( kids[1].y, kids[0].y + layoutBlock( obj ).h, "next statement starts below the overhanging value" );
} );

test( "an empty fork still leaves room for one statement", ()=>{
	const node = layoutBlock( instance( 'while' ) );
	const body = node.rows.find( r=>r.type === 'headerfork' );
	near( body.h, metrics.rowH + metrics.htabH + metrics.forkGap );
} );

test( "a tall value plugged into a field pushes the rows below it down", ()=>{
	const flat = instance( 'class', { sections:{ fields:[ { fields:{ key:'a' } }, { fields:{ key:'b' } } ] } } );
	const obj = instance( 'object', { sections:{ fields:[ { fields:{ key:'p' } }, { fields:{ key:'q' } } ] } } );
	const deep = instance( 'class', { sections:{ fields:[ { fields:{ key:'a' }, inputs:{ value:obj } }, { fields:{ key:'b' } } ] } } );
	const f = layoutBlock( flat ), d = layoutBlock( deep );
	const objH = layoutBlock( obj ).h;
	near( d.h - f.h, objH - metrics.rowH, "block grew by the object's extra height" );
	const rowB = d.rows.filter( r=>r.type === 'input' )[1];
	near( rowB.y, metrics.rowH + objH, "field b moved below the object" );
	const kid = d.children[0];
	near( kid.x, rowB.x + d.rows[1].input.x + metrics.vtabW, "object's tab sits in the slot" );
} );

test( "a value plugged into the header pushes the body down", ()=>{
	const base = instance( 'object', { sections:{ fields:[ { fields:{ key:'p' } }, { fields:{ key:'q' } } ] } } );
	const c = layoutBlock( instance( 'class', { inputs:{ base }, sections:{ fields:[ { fields:{ key:'a' } } ] } } ) );
	near( c.rows[1].y, layoutBlock( base ).h );
} );

test( "the header spans the widest row below it", ()=>{
	const node = layoutBlock( instance( 'object', { sections:{ fields:[ { fields:{ key:'aVeryLongFieldName' } } ] } } ) );
	const row = node.rows.find( r=>r.type === 'input' );
	assert( row.w > layoutBlock( instance( 'object' ) ).w, "the row is wider than a bare header" );
	near( node.rows[0].w, row.w );
	near( node.w, row.w );
	near( node.rows[0].input === null ? 0 : 1, 0 );
} );

test( "section limits are enforced", ()=>{
	assert.throws( ()=> instance( 'switch', { sections:{ 'default':[ {}, {} ] } } ) );
	assert.throws( ()=> instance( 'nope' ) );
} );

test( "tiled shapes keep every face inside the layout box", ()=>{
	const inst = instance( 'switch', { sections:{ cases:[ { statements:[ call( 'a' ) ] } ] } } );
	walk( layoutBlock( inst ), ( node )=>{
		const shape = tileBlock( node );
		for( const v of shape.verts ) {
			assert( v.x >= -metrics.vtabW - 1e-9 && v.x <= node.w + 1e-9, node.kind + " x " + v.x + " in [" + -metrics.vtabW + "," + node.w + "]" );
			assert( v.z >= -1e-9 && v.z <= node.h + metrics.htabH + 1e-9, node.kind + " z " + v.z );
		}
	} );
} );

test( "svg renders", ()=>{
	const svg = render( layoutBlock( instance( 'if' ) ) );
	assert( svg.startsWith( "<svg" ) && svg.includes( "if" ) );
} );

console.log( passed + " layout tests passed" + ( process.exitCode ? ", some failed" : "" ) );
