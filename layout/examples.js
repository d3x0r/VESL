// node layout/examples.js
// Writes layout/examples/*.svg: the 2D silhouette of a few blocks and the
// top-down projection of their tiled 3D pieces.

const fs = require( "fs" );
const path = require( "path" );
const { layoutBlock, walk } = require( "./layout.js" );
const { tileBlock, shapeToSVG } = require( "./tiler.js" );
const { render } = require( "./svg.js" );

const examples = require( "./samples.js" ).samples();

const dir = path.join( __dirname, "examples" );
fs.mkdirSync( dir, { recursive:true } );
for( const name in examples ) {
	const node = layoutBlock( examples[name] );
	fs.writeFileSync( path.join( dir, name + ".svg" ), render( node ) );
	// tile every block in the tree into one top-down picture
	const parts = [];
	walk( node, ( n, ox, oy )=>{
		const shape = tileBlock( n );
		if( n.lift ) for( const v of shape.verts ) v.y += n.lift * 0.001;   // lifted values draw on top
		for( const v of shape.verts ) { v.x += ox; v.z += oy; }
		for( const l of shape.labels ) { l.pos.x += ox; l.pos.z += oy; }
		parts.push( shape );
	} );
	const merged = { verts:[], norms:[], pairs:[], faces:[], labels:[] };
	for( const s of parts ) {
		const o = { v:merged.verts.length, n:merged.norms.length, p:merged.pairs.length };
		merged.verts.push( ...s.verts ); merged.norms.push( ...s.norms );
		merged.pairs.push( ...s.pairs.map( p=>[ p[0]+o.v, p[1]+o.n ] ) );
		merged.faces.push( ...s.faces.map( f=>f.map( i=>i+o.p ) ) );
		merged.labels.push( ...s.labels );
	}
	fs.writeFileSync( path.join( dir, name + "-tiled.svg" ), shapeToSVG( merged, { scale:120 } ) );
	console.log( name.padEnd( 10 ), "w", node.w.toFixed( 2 ), "h", node.h.toFixed( 2 ), "blocks", parts.length, "faces", merged.faces.length );
}
