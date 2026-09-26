// Render a layout tree as an SVG silhouette. Useful for eyeballing the
// layout pass without three.js, and as a 2D renderer in its own right.

const { metrics, walk, bounds } = require( "./layout.js" );

const palette = {
	statement : [ '#4c8dd6', '#3b74b5' ],
	value     : [ '#e0a03a', '#c2862a' ],
};

function esc( s ) { return String( s ).replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' ); }

function render( root, opts ) {
	opts = opts || {};
	const S = opts.scale || 100;
	const b = bounds( root );
	const margin = 0.3;
	const out = [];
	const W = ( b.x1 - b.x0 + 2*margin ) * S, H = ( b.y1 - b.y0 + 2*margin ) * S;
	out.push( `<svg xmlns="http://www.w3.org/2000/svg" width="${W.toFixed(0)}" height="${H.toFixed(0)}" viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" font-family="sans-serif">` );
	out.push( `<rect width="100%" height="100%" fill="#f4f4f0"/>` );
	out.push( `<g transform="translate(${((margin - b.x0)*S).toFixed(1)},${((margin - b.y0)*S).toFixed(1)})">` );

	walk( root, ( n, ox, oy )=>{
		const m = metrics;
		// a lifted value casts a little shadow so the layering reads in 2D
		if( n.lift ) out.push( `<rect x="${(ox+0.06)*S}" y="${(oy+0.06)*S}" width="${n.w*S}" height="${n.h*S}" fill="rgba(0,0,0,0.25)"/>` );
		const kind = n.def.left === 'value' ? 'value' : 'statement';
		const fill = palette[kind][0], edge = palette[kind][1];
		const r = ( x, y, w, h, f, ghost )=> out.push( `<rect x="${(ox+x)*S}" y="${(oy+y)*S}" width="${w*S}" height="${h*S}" fill="${f||fill}" stroke="${edge}" stroke-width="1"${ghost ? ' opacity="0.35" stroke-dasharray="4 3"' : ''}/>` );
		out.push( `<g class="block ${n.kind}">` );
		for( const row of n.rows ) {
			if( row.type === 'header' ) r( 0, row.y, n.headerW || row.w, row.h );
			else if( row.type === 'footer' ) r( row.x || 0, row.y, row.w - ( row.x || 0 ), row.h );
			else if( row.type === 'input' || row.type === 'fork' ) {
				r( 0, row.y, m.barW, row.h );
				r( m.barW, row.y, row.stubW, m.rowH, null, row.ghost );
			}
			else if( row.type === 'post' ) r( n.post.x, row.y, n.post.w, row.h );
			else r( 0, row.y, m.barW, row.h );   // spacer / headerfork
		}
		for( const c of n.connectors ) {
			if( c.ghost && !n.post ) continue;   // a post's ghost is a real notch
			const carve = '#f4f4f0';
			if( c.dir === 'statement' && c.type === 'slot' ) r( c.x, c.y, m.htabW, m.htabH, carve );
			if( c.dir === 'statement' && c.type === 'tab' )  r( c.x, c.y, m.htabW, m.htabH );
			if( c.dir === 'value' && c.type === 'slot' ) r( c.x, c.y, m.vtabW, m.rowH - 2*m.pad, carve );
			if( c.dir === 'value' && c.type === 'tab' )  r( c.x, c.y, m.vtabW, m.rowH - 2*m.pad );
		}
		for( const l of n.labels ) {
			const italic = l.cell.type === 'name' ? ' font-style="italic"' : '';
			out.push( `<text x="${(ox+l.x)*S}" y="${(oy+l.y+l.h*0.8)*S}" font-size="${(l.h*0.8*S).toFixed(0)}" fill="#111"${italic}${l.ghost ? ' opacity="0.4"' : ''}>${esc(l.text)}</text>` );
		}
		out.push( `</g>` );
	} );
	out.push( `</g></svg>` );
	return out.join( "\n" );
}

module.exports = exports = { render };
