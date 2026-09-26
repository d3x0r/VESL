// Tiler: layout rectangles -> C-beam pieces.
//
// A block is the union of a few rectangular regions: the header bar, the
// left bar, stubs off the bar (one per body row) and the footer bar. Each
// region gets a flat fill and the swell/corner/slot pieces that its edges
// call for. Which edges exist follows from the layout, so nothing here is
// specific to any one block kind.
//
// Coordinates: layout x -> x, layout y -> z (downward on the piece), y is
// the piece thickness, exactly as shapes/compose.js builds its parts.

const compose = require( "../shapes/compose.js" );
const { metrics } = require( "./layout.js" );
const { consts, tween, hbar_swell, vbar_swell, corner, slot, Shape, addShape } = compose;

const EPS = 1e-6;
const pad = metrics.pad;

// how far the corner normals of a fill lean toward its centre
const DISH = 0.12;
function dishFill( w, h ) {
	const y = consts.peice_depth;
	const n = ( x, z )=>{ const l = Math.hypot( x, 1, z ); return { x:x/l, y:1/l, z:z/l }; };
	return {
		verts : [ { x:0, y, z:0 }, { x:w, y, z:0 }, { x:0, y, z:h }, { x:w, y, z:h }, { x:w/2, y, z:h/2 } ],
		norms : [ n( DISH, DISH ), n( -DISH, DISH ), n( DISH, -DISH ), n( -DISH, -DISH ), { x:0, y:1, z:0 } ],
		pairs : [ [0,0], [1,1], [2,2], [3,3], [4,4] ],
		faces : [ [0,4,1], [1,4,3], [3,4,2], [2,4,0] ],
		scaledVert( i ) { return this.verts[i]; },
	};
}

// A piece mirrored across x (its x range folded back onto [0, width]),
// for the concave corner on the far side of a post.
function mirrorX( piece ) {
	const w = Math.max( ...piece.verts.map( v=>v.x ) );
	return {
		verts : piece.verts.map( v=>( { x: w - v.x, y:v.y, z:v.z } ) ),
		norms : piece.norms.map( n=>( { x:-n.x, y:n.y, z:n.z } ) ),
		pairs : piece.pairs,
		faces : piece.faces.map( f=>[ f[0], f[2], f[1] ] ),
		scaledVert( i ) { return this.verts[i]; },
	};
}
const inner0m = mirrorX( corner.inner0 );

function Tiler( shape ) {
	this.shape = shape;
}
Tiler.prototype = {
	at( piece, x, z, scale, s2 ) {
		addShape( this.shape, piece, { x, y:0, z }, scale, s2 );
	},
	hswell( kind, x0, x1, z ) {           // horizontal edge swell over [x0,x1]
		if( x1 - x0 > EPS ) this.at( hbar_swell[kind], x0, z, x1 - x0 );
	},
	vswell( kind, x, z0, z1 ) {           // vertical edge swell over [z0,z1]
		if( z1 - z0 > EPS ) this.at( vbar_swell[kind], x, z0, z1 - z0 );
	},
	corner( name, x, z ) { this.at( corner[name], x, z ); },
	// Top and bottom faces of an interior rectangle. The top is a fan of
	// four triangles around a centre vertex, with the corner normals leaning
	// inward, so the surface reads as a slight dish (like the keyboard keys)
	// and has no diagonal seam.
	fill( x0, z0, x1, z1 ) {
		if( x1 - x0 <= EPS || z1 - z0 <= EPS ) return;
		this.at( dishFill( x1 - x0, z1 - z0 ), x0, z0 );
		this.at( tween.key_bottom, x0, z0, x1 - x0, z1 - z0 );
	},
	// bottom edge of a region between x0 and x1 at z, optionally carrying a
	// statement tab whose left edge is at tabX
	bottomEdge( x0, x1, z, tabX ) {
		if( tabX === undefined ) { this.hswell( 'lower', x0, x1, z ); return; }
		if( tabX - x0 > EPS ) {
			if( tabX - x0 <= pad + EPS ) this.at( hbar_swell.lower_inner_tab, x0, z );
			else this.hswell( 'lower', x0, tabX, z );
		}
		this.at( slot.horiz_tab, tabX, z );
		this.hswell( 'lower', tabX + metrics.htabW, x1, z );
	},
	// top edge of a region between x0 and x1 at z, optionally carved with a
	// statement slot whose left edge is at slotX
	topEdge( x0, x1, z, slotX ) {
		if( slotX === undefined ) { this.hswell( 'upper', x0, x1, z ); return; }
		this.hswell( 'upper', x0, slotX, z );
		this.at( slot.horiz_slot, slotX, z );
		this.hswell( 'upper', slotX + metrics.htabW, x1, z );
	},
	// the right end of a bar: either a plain edge or a value slot
	rightEnd( xe, z0, z1, withSlot ) {
		this.corner( 'outer1', xe - pad, z0 - pad );
		this.corner( 'outer3', xe - pad, z1 );
		if( withSlot ) this.at( slot.vert_slot, xe - metrics.slotW, z0 );
		else this.vswell( 'right', xe - pad, z0, z1 );
	},
};

// Build one block (not its children) from its layout node.
function tileBlock( node ) {
	if( node.post ) return tilePost( node );
	const m = metrics;
	const shape = Shape( node.kind );
	const t = new Tiler( shape );
	shape.ghost = Shape( node.kind + ' ghost' );   // the faint "add one" stubs, drawn translucent
	const tg = new Tiler( shape.ghost );
	const W = node.w, H = node.h, rowH = m.rowH, barW = m.barW;
	const style = node.corner;
	const header = node.rows[0];
	const slotDepth = m.htabH + pad;     // how far a statement slot is carved into the top

	shape.size.width = W;
	shape.size.height = H;
	shape.layout = node;

	// ---- outer left edge, whole height --------------------------------------
	t.corner( 'outer0', 0, 0 );
	t.corner( 'outer2', 0, H - pad );
	if( style.leftTab ) {
		t.at( slot.vert_tab, -m.vtabW, pad );
		t.vswell( 'left', 0, rowH - pad, H - pad );
	} else
		t.vswell( 'left', 0, pad, H - pad );

	// ---- header ------------------------------------------------------------
	const slotX = style.topSlot ? pad : undefined;
	t.topEdge( pad, W - pad, 0, slotX );
	t.rightEnd( W, pad, rowH - pad, header.endsWithSlot );
	// the fill stops where the end piece begins: a value slot piece carries
	// its own top face around the notch
	const fillEnd = W - ( header.endsWithSlot ? m.slotW : pad );
	if( style.topSlot ) {
		t.fill( pad, slotDepth, pad + m.htabW, rowH - pad );
		t.fill( pad + m.htabW, pad, fillEnd, rowH - pad );
	} else
		t.fill( pad, pad, fillEnd, rowH - pad );

	if( node.compact ) {
		t.bottomEdge( pad, W - pad, rowH - pad, node.def.bottom === 'statement' ? pad : undefined );
		placeLabels( shape, node );
		return shape;
	}

	// header underside, right of the bar
	t.corner( 'inner0', barW - pad, rowH - pad );
	t.bottomEdge( barW, W - pad, rowH - pad, style.innerTab ? barW + pad : undefined );

	// ---- the bar and its stubs -------------------------------------------
	const footer = node.rows[node.rows.length - 1];
	t.fill( pad, rowH - pad, barW - pad, footer.y + pad );
	let rz = rowH;                                   // where the bar's right swell resumes
	for( const row of node.rows ) {
		if( row.type !== 'input' && row.type !== 'fork' ) continue;
		t.vswell( 'right', barW - pad, rz, row.y );
		t.corner( 'inner1', barW - pad, row.y );
		tileStub( row.ghost ? tg : t, row );
		t.corner( 'inner0', barW - pad, row.y + rowH - pad );
		rz = row.y + rowH;
	}
	t.vswell( 'right', barW - pad, rz, footer.y );
	t.corner( 'inner1', barW - pad, footer.y );

	// ---- footer ------------------------------------------------------------
	t.hswell( 'upper', barW, W - pad, footer.y );
	t.rightEnd( W, footer.y + pad, H - pad, false );
	t.fill( pad, footer.y + pad, W - pad, H - pad );
	t.bottomEdge( pad, W - pad, H - pad, footer.tab ? pad : undefined );

	placeLabels( shape, node );
	return shape;
}

// A post block: header with the first slot, a post under it with a slot
// notched into its right side per remaining operand (the ghost is just an
// empty notch), and a short footer.
function tilePost( node ) {
	const m = metrics;
	const shape = Shape( node.kind );
	shape.ghost = Shape( node.kind + ' ghost' );
	const t = new Tiler( shape );
	const W = node.headerW, H = node.h, rowH = m.rowH;
	const px = node.post.x, xe = px + node.post.w;   // post left / right
	const footer = node.rows[node.rows.length - 1];
	const FW = footer.w;                             // the footer reaches past the slots
	shape.size.width = node.w; shape.size.height = H; shape.layout = node;

	// header
	t.corner( 'outer0', 0, 0 );
	t.corner( 'outer2', 0, rowH - pad );
	if( node.corner.leftTab ) t.at( slot.vert_tab, -m.vtabW, pad );
	else t.vswell( 'left', 0, pad, rowH - pad );
	t.topEdge( pad, W - pad, 0 );
	t.rightEnd( W, pad, rowH - pad, true );
	t.fill( pad, pad, W - m.slotW, rowH - pad );
	// underside: left of the post, then the post's far corner
	t.hswell( 'lower', pad, px, rowH - pad );
	t.at( inner0m, px, rowH - pad );

	// post: left edge straight down into the footer; right edge is slots
	// separated by short swell segments
	t.vswell( 'left', px, rowH, H - pad );
	t.corner( 'outer2', px, H - pad );
	let rz = rowH - pad;                 // right edge continues from the header's slot piece
	for( const row of node.rows ) {
		if( row.type !== 'post' ) continue;
		t.vswell( 'right', xe - pad, rz, row.y + pad );
		t.fill( xe - m.slotW, rz, xe - pad, row.y + pad );
		t.at( slot.vert_slot, xe - m.slotW, row.y + pad );
		rz = row.y + rowH - pad;
	}
	t.vswell( 'right', xe - pad, rz, footer.y );
	t.fill( xe - m.slotW, rz, xe - pad, footer.y + pad );
	t.fill( px + pad, rowH - pad, xe - m.slotW, footer.y + pad );
	t.corner( 'inner1', xe - pad, footer.y );

	// footer
	t.hswell( 'upper', xe, FW - pad, footer.y );
	t.rightEnd( FW, footer.y + pad, H - pad, false );
	t.fill( px + pad, footer.y + pad, FW - pad, H - pad );   // the whole foot, under the post too
	t.hswell( 'lower', px + pad, FW - pad, H - pad );

	placeLabels( shape, node );
	return shape;
}

// A stub off the bar: [ labels... ][slot or end]; a fork stub also carries a
// statement tab under its first htabW.
function tileStub( t, row ) {
	const m = metrics;
	const barW = m.barW, rowH = m.rowH;
	const xe = barW + row.stubW;
	const z = row.y;
	t.hswell( 'upper', barW, xe - pad, z );
	t.rightEnd( xe, z + pad, z + rowH - pad, !!row.input );
	t.bottomEdge( barW, xe - pad, z + rowH - pad, row.type === 'fork' ? barW + pad : undefined );
	t.fill( barW - pad, z + pad, xe - ( row.input ? m.slotW : pad ), z + rowH - pad );
}

function placeLabels( shape, node ) {
	for( const l of node.labels )
		shape.labels.push( { text:l.text, cell:l.cell, ghost:l.ghost,
			pos:{ x:l.x, y:consts.peice_depth + consts.inset_depth, z:l.y },
			size:{ width:l.w, height:l.h } } );
	if( shape.labels.length ) {
		const l = shape.labels[0];
		shape.label.pos.set( l.pos.x, l.pos.y, l.pos.z );
		shape.label.size.width = l.size.width;
		shape.label.size.height = l.size.height;
	}
}

// Debug view: project a tiled shape's faces straight down onto x/z as SVG,
// shaded by their normals, so the tiling can be checked without three.js.
function shapeToSVG( shape, opts ) {
	opts = opts || {};
	const S = opts.scale || 200;
	let x0 = Infinity, z0 = Infinity, x1 = -Infinity, z1 = -Infinity;
	for( const v of shape.verts ) { x0 = Math.min( x0, v.x ); x1 = Math.max( x1, v.x ); z0 = Math.min( z0, v.z ); z1 = Math.max( z1, v.z ); }
	const mg = 0.1;
	const out = [];
	if( !opts.inner ) {
		out.push( `<svg xmlns="http://www.w3.org/2000/svg" width="${((x1-x0+2*mg)*S)|0}" height="${((z1-z0+2*mg)*S)|0}">`,
			`<rect width="100%" height="100%" fill="#222"/>`,
			`<g transform="translate(${(mg-x0)*S},${(mg-z0)*S})">` );
	}
	const light = { x:-0.3, y:0.85, z:-0.4 };
	if( shape.ghost && shape.ghost.faces.length ) {
		out.push( `<g opacity="0.35">` );
		out.push( shapeToSVG( shape.ghost, { scale:S, inner:true } ) );
		out.push( `</g>` );
	}
	for( const f of shape.faces ) {
		const ps = f.map( i => shape.verts[shape.pairs[i][0]] );
		const ns = f.map( i => shape.norms[shape.pairs[i][1]] );
		const n = ns[0];
		if( n.y < 0 ) continue;   // bottom faces
		const d = Math.max( 0, n.x*light.x + n.y*light.y + n.z*light.z );
		const c = ( 60 + 180*d ) | 0;
		out.push( `<polygon points="${ps.map( p=>( p.x*S ).toFixed(1)+','+( p.z*S ).toFixed(1) ).join(' ')}" fill="rgb(${c},${(c*0.85)|0},${(c*0.4)|0})" stroke="rgba(0,0,0,0.25)" stroke-width="0.5"/>` );
	}
	const esc = ( t )=> String( t ).replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' );
	for( const l of shape.labels || [] )
		out.push( `<text x="${l.pos.x*S}" y="${(l.pos.z + l.size.height*0.8)*S}" font-size="${l.size.height*0.8*S}" font-family="sans-serif" fill="#000">${esc( l.text )}</text>` );
	if( !opts.inner ) out.push( `</g></svg>` );
	return out.join( "\n" );
}

// Sanity checks a test can run on any tiled shape.
function validate( shape ) {
	const problems = [];
	shape.verts.forEach( ( v, i )=>{ if( ![v.x,v.y,v.z].every( Number.isFinite ) ) problems.push( "vert " + i + " not finite" ); } );
	shape.pairs.forEach( ( p, i )=>{ if( p[0] >= shape.verts.length || p[1] >= shape.norms.length ) problems.push( "pair " + i + " out of range" ); } );
	shape.faces.forEach( ( f, i )=>{ if( f.some( k => k >= shape.pairs.length ) ) problems.push( "face " + i + " out of range" ); } );
	return problems;
}

module.exports = exports = { tileBlock, shapeToSVG, validate, Tiler };
