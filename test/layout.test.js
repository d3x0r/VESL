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

function withLift( lift, fn ) {
	const was = metrics.liftValues; metrics.liftValues = lift;
	try { fn(); } finally { metrics.liftValues = was; }
}
const inPlane = ( fn )=> withLift( false, fn );
const lifted = ( fn )=> withLift( true, fn );


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
	assert( !a.compact, "a call shows a ghost argument row" );
	near( b.h - a.h, metrics.rowH, "one more input row" );
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

test( "a compact statement stays one row when a tall value is plugged in, but stacks below it (in-plane mode)", ()=> inPlane( ()=>{
	const obj = instance( 'object', { sections:{ fields:[ { fields:{ key:'p' } }, { fields:{ key:'q' } } ] } } );
	const ret = layoutBlock( instance( 'return', { inputs:{ value:obj } } ) );
	assert( ret.compact );
	near( ret.h, metrics.rowH );
	near( ret.stackH, layoutBlock( obj ).h );
	const fn = layoutBlock( instance( 'function', { sections:{ body:[ { statements:[ instance( 'return', { inputs:{ value:obj } } ), call( 'after' ) ] } ] } } ) );
	const kids = fn.children.filter( c=>c.via.name === 'body' );
	near( kids[1].y, kids[0].y + layoutBlock( obj ).h, "next statement starts below the overhanging value" );
} ) );

test( "an empty fork still leaves room for one statement", ()=>{
	const node = layoutBlock( instance( 'while' ) );
	const body = node.rows.find( r=>r.type === 'headerfork' );
	near( body.h, metrics.rowH + metrics.htabH + metrics.forkGap );
} );

test( "with liftValues, a plugged value floats a layer above and leaves the rows alone", ()=> lifted( ()=>{
	const obj = instance( 'object', { sections:{ fields:[ { fields:{ key:'p' } }, { fields:{ key:'q' } } ] } } );
	const flat = layoutBlock( instance( 'class', { sections:{ fields:[ { fields:{ key:'a' } }, { fields:{ key:'b' } } ] } } ) );
	const deep = layoutBlock( instance( 'class', { sections:{ fields:[ { fields:{ key:'a' }, inputs:{ value:obj } }, { fields:{ key:'b' } } ] } } ) );
	near( deep.h, flat.h );
	assert.equal( deep.children[0].lift, 1 );
	const ret = layoutBlock( instance( 'return', { inputs:{ value:obj } } ) );
	near( ret.stackH, ret.h, "nothing overhangs in the plane" );
} ) );

test( "a tall value plugged into a field pushes the rows below it down (in-plane mode)", ()=> inPlane( ()=>{
	const flat = instance( 'class', { sections:{ fields:[ { fields:{ key:'a' } }, { fields:{ key:'b' } } ] } } );
	// (ghost rows are present in both, so the difference is only the object's height)
	const obj = instance( 'object', { sections:{ fields:[ { fields:{ key:'p' } }, { fields:{ key:'q' } } ] } } );
	const deep = instance( 'class', { sections:{ fields:[ { fields:{ key:'a' }, inputs:{ value:obj } }, { fields:{ key:'b' } } ] } } );
	const f = layoutBlock( flat ), d = layoutBlock( deep );
	const objH = layoutBlock( obj ).h;
	near( d.h - f.h, objH - metrics.rowH, "block grew by the object's extra height" );
	const rowB = d.rows.filter( r=>r.type === 'input' )[1];
	near( rowB.y, metrics.rowH + objH, "field b moved below the object" );
	const kid = d.children[0];
	near( kid.x, rowB.x + d.rows[1].input.x + metrics.vtabW, "object's tab sits in the slot" );
} ) );

test( "a value plugged into the header pushes the body down (in-plane mode)", ()=> inPlane( ()=>{
	const base = instance( 'object', { sections:{ fields:[ { fields:{ key:'p' } }, { fields:{ key:'q' } } ] } } );
	const c = layoutBlock( instance( 'class', { inputs:{ base }, sections:{ fields:[ { fields:{ key:'a' } } ] } } ) );
	near( c.rows[1].y, layoutBlock( base ).h );
} ) );

test( "the header spans the widest row below it", ()=>{
	const node = layoutBlock( instance( 'object', { sections:{ fields:[ { fields:{ key:'aVeryLongFieldName' } } ] } } ) );
	const row = node.rows.find( r=>r.type === 'input' );
	assert( row.w > layoutBlock( instance( 'object' ) ).w, "the row is wider than a bare header" );
	near( node.rows[0].w, row.w );
	near( node.w, row.w );
	near( node.rows[0].input === null ? 0 : 1, 0 );
} );

test( "sections that can still grow end with a ghost row", ()=>{
	const empty = layoutBlock( instance( 'switch' ) );
	const forks = empty.rows.filter( r=>r.type === 'fork' );
	assert.equal( forks.length, 1 );
	assert( forks[0].ghost );
	assert( empty.connectors.filter( c=>c.ghost ).length >= 2, "ghost slot and ghost tab" );
	const one = layoutBlock( instance( 'switch', { sections:{ cases:[ { statements:[ call( 'a' ) ] } ] } } ) );
	const f1 = one.rows.filter( r=>r.type === 'fork' );
	assert.equal( f1.length, 2 );
	assert( !f1[0].ghost && f1[1].ghost );
	// a section at its limit shows no ghost
	const full = layoutBlock( instance( 'class', { sections:{ constructor:[ { statements:[] } ] } } ) );
	const ctor = full.rows.filter( r=>r.type === 'fork' && r.section.name === 'constructor' );
	assert.equal( ctor.length, 1 );
	assert( !ctor[0].ghost );
	// ghost stubs are tiled into the separate translucent shape
	const shape = tileBlock( empty );
	assert( shape.ghost.faces.length > 0 );
} );

test( "section limits are enforced", ()=>{
	assert.throws( ()=> instance( 'class', { sections:{ 'constructor':[ {}, {} ] } } ) );
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

test( "fills never cover a value slot cavity", ()=>{
	const node = layoutBlock( instance( 'interface', { sections:{ properties:[ { fields:{ key:'area' } } ] } } ) );
	const shape = tileBlock( node );
	const { tween } = require( "../shapes/compose.js" );
	// key_fill quads are the only 4-vertex top faces at full depth; find their x extents
	const slots = node.connectors.filter( c=>c.type === 'slot' && c.dir === 'value' && !c.ghost );
	assert( slots.length === 2 );
	for( const c of slots ) {
		const cavity = { x0:c.x, x1:c.x + metrics.vtabW, z0:c.y, z1:c.y + metrics.rowH - 2*metrics.pad };
		for( const f of shape.faces ) {
			const ps = f.map( i=>shape.verts[shape.pairs[i][0]] );
			if( !ps.every( p=>Math.abs( p.y - tween.key_fill.verts[0].y ) < 1e-9 ) ) continue;
			const cx = ps.reduce( ( a, p )=>a + p.x, 0 ) / 3, cz = ps.reduce( ( a, p )=>a + p.z, 0 ) / 3;
			const inside = cx > cavity.x0 + 1e-6 && cx < cavity.x1 - 1e-6 && cz > cavity.z0 + 1e-6 && cz < cavity.z1 - 1e-6;
			const wide = Math.max( ...ps.map( p=>p.x ) ) - Math.min( ...ps.map( p=>p.x ) ) > metrics.vtabW * 2;
			assert( !( inside && wide ), "a fill face covers the slot at " + c.name );
		}
	}
} );

test( "svg renders", ()=>{
	const svg = render( layoutBlock( instance( 'if' ) ) );
	assert( svg.startsWith( "<svg" ) && svg.includes( "if" ) );
} );

console.log( passed + " layout tests passed" + ( process.exitCode ? ", some failed" : "" ) );
