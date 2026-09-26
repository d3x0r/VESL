// Layout pass: block instance -> rectangles.
//
// Everything here is plain numbers in block-local units (the same units the
// 3D pieces use: x to the right, y downward; the tiler maps y onto z).
// No geometry is produced; tiler.js and svg.js both consume this output.

const consts = require( "../shapes/consts.js" );
const { cellText } = require( "./blockdef.js" );

const pad = consts.swell_pad;
const metrics = {
	pad,
	rowH    : consts.top_hbar_height + 2*pad,          // one bar row (0.55)
	barW    : consts.vbar_width + 2*pad,               // the left bar (0.25)
	htabW   : consts.htab_width,                       // statement tab/slot width
	htabH   : consts.htab_height,                      // how far a statement tab protrudes
	vtabW   : consts.vtab_width,                       // value tab width
	slotW   : consts.vtab_width + pad,                 // width of a value-slot end piece
	endW    : pad,                                     // width of a plain end piece
	forkW   : consts.htab_width + pad,                 // the fork stub carrying a statement tab
	footH   : consts.bot_hbar_height + 2*pad,          // bottom bar row (0.25)
	forkGap : 0.15,                                    // bar shown below a fork body
	rowGap  : 0.15,                                    // bar shown between header/input rows and a fork row
	charW   : 0.20,                                    // text width per character
	textPad : 0.10,                                    // padding either side of a text cell
	textH   : consts.top_hbar_height - 2*( consts.inset*2 + consts.inset_pad ),
	minFill : 0.5,                                     // header/stub never thinner than this
	// Where a value plugged into a slot goes. false: it sits in the board
	// plane and pushes the rows below it down (like wrapping a long
	// expression onto following lines). true: it floats one layer above the
	// board (child.lift = 1) and the rows below are not disturbed.
	liftValues : false,
	liftHeight : consts.peice_depth * 1.25,            // 3D height of one layer
};

function measure( text ) {
	return text.length * metrics.charW + 2*metrics.textPad;
}

// Which top-left corner the header needs.
//   topSlot  : statement slot carved into the top
//   leftTab  : value output tab on the left
//   innerTab : a statement tab under the header (blockly-style first body)
function cornerStyle( def, headerFork ) {
	return {
		topSlot  : def.top === 'statement',
		leftTab  : def.left === 'value',
		innerTab : !!headerFork,
		hasBody  : def.sections.length > 0,
	};
}
function cornerWidth( style ) {
	if( style.leftTab ) return metrics.barW;
	if( style.topSlot || style.innerTab ) return metrics.barW + metrics.htabW;
	return metrics.barW;
}

// The first section merges into the header when it is a single mandatory
// body with nothing but statements (if/while/for/function): the body hangs
// from a tab under the header instead of a separate fork row.
function headerForkSection( def ) {
	const s = def.sections[0];
	if( s && s.kind === 'fork' && s.min === 1 && s.max === 1 && s.cells.length === 1 ) return s;
	return null;
}

function layoutBlock( inst ) {
	const def = inst.def;
	const m = metrics;
	const node = { inst, def, kind: def.kind, x:0, y:0, w:0, h:0, rows:[], cells:[], connectors:[], children:[], labels:[] };

	const hfork = headerForkSection( def );
	const style = cornerStyle( def, hfork );
	node.corner = style;
	node.corner.w = cornerWidth( style );
	// a statement with nothing hanging below it needs no bar: its top slot
	// piece is the whole corner
	if( !style.hasBody && !style.leftTab ) node.corner.w = metrics.pad + metrics.htabW;

	// ---- header row --------------------------------------------------------
	const header = { type:'header', y:0, h:m.rowH, x:0, cells:[], input:null };
	let x = node.corner.w;
	let textW = 0;
	for( const c of def.header ) {
		if( c.type === 'input' ) {
			header.input = { type:'input', slot:c.slot, x, y:0, w:m.slotW, h:m.rowH, child:inst.inputs[c.slot] || null };
			header.cells.push( header.input );
			x += m.slotW;
		} else {
			const text = cellText( c, inst.fields );
			const w = measure( text );
			header.cells.push( { type:c.type, text, field:c.field, x, y:0, w, h:m.rowH } );
			x += w; textW += w;
		}
	}
	if( textW < m.minFill ) { // pad the label area so the bar has some length
		const extra = m.minFill - textW;
		if( header.input ) header.input.x += extra;
		x += extra;
	}
	if( !header.input ) x += m.endW;
	header.w = x;
	header.endsWithSlot = !!header.input;
	node.rows.push( header );

	let y = m.rowH;
	let widest = header.w;
	// a compact block has nothing hanging off a bar: the header is the block
	node.compact = !hfork && def.sections.every( s => inst.sections[s.name].length === 0 && !( s.ghost && s.max > 0 ) );
	let headerChildH = 0;
	if( header.input && header.input.child ) {
		const child = layoutBlock( header.input.child );
		header.input.childNode = child;
		if( !metrics.liftValues ) {
			headerChildH = child.stackH;
			if( !node.compact ) y = Math.max( y, child.stackH );   // the body starts below the plugged value
		}
	}

	// ---- header fork body --------------------------------------------------
	if( hfork ) {
		const entry = inst.sections[hfork.name][0];
		const body = layoutStatements( entry.statements, node, m.barW + pad, y );
		const row = { type:'headerfork', section:hfork, entry, y, h: body.h + m.forkGap, x:0, w:m.barW, body };
		node.rows.push( row );
		y += row.h;
	}

	// ---- section rows ------------------------------------------------------
	let prev = hfork ? 'fork' : 'header';
	for( const s of def.sections ) {
		if( s === hfork ) continue;
		const entries = inst.sections[s.name].slice();
		// a ghost row: an empty entry shown faintly while the section can
		// still take another one; dropping onto it creates the entry
		if( s.ghost && entries.length < s.max )
			entries.push( { fields:{}, inputs:{}, statements:[], ghost:true } );
		for( const entry of entries ) {
			if( s.kind === 'fork' && prev !== 'fork' ) {
				node.rows.push( { type:'spacer', y, h:m.rowGap, x:0, w:m.barW } );
				y += m.rowGap;
			}
			const row = s.kind === 'input'
				? layoutInputRow( s, entry, node, y )
				: layoutForkRow( s, entry, node, y );
			row.ghost = !!entry.ghost;
			node.rows.push( row );
			y += row.h;
			widest = Math.max( widest, row.w );
			prev = s.kind;
		}
	}
	let footer = null;
	if( !node.compact ) {
		if( prev === 'input' || prev === 'header' ) {
			// bar always shows a little before the footer turns the corner
			node.rows.push( { type:'spacer', y, h:m.rowGap, x:0, w:m.barW } );
			y += m.rowGap;
		}
		// ---- footer --------------------------------------------------------
		footer = { type:'footer', y, h:m.footH, x:0, w:0, tab: def.bottom === 'statement' };
		node.rows.push( footer );
		y += m.footH;
	}

	// the top bar spans everything hanging below it
	header.w = widest;
	if( header.input ) header.input.x = widest - m.slotW;
	if( footer ) footer.w = widest;
	node.w = widest;
	node.h = y;
	// how much vertical room this block takes in a stack of statements: a
	// compact statement stays one row, but a tall value plugged into it
	// overhangs, and the next statement has to start below that
	node.stackH = Math.max( node.h, headerChildH );

	// ---- connectors --------------------------------------------------------
	if( style.topSlot ) node.connectors.push( { type:'slot', dir:'statement', name:'top', x:pad, y:0 } );
	if( def.bottom === 'statement' ) node.connectors.push( { type:'tab', dir:'statement', name:'bottom', x:pad, y:node.h } );
	if( style.leftTab ) node.connectors.push( { type:'tab', dir:'value', name:'left', x:-m.vtabW, y:pad } );
	if( header.input ) addValueSlot( node, header.input, null );
	if( hfork ) {
		const row = node.rows[1];
		attachStatements( node, { type:'tab', dir:'statement', name:hfork.name, x:m.barW + pad, y:m.rowH, section:hfork, entry:row.entry }, row.body );
	}
	for( const row of node.rows ) {
		const before = node.connectors.length;
		if( row.type === 'input' ) addValueSlot( node, row.input, row );
		if( row.type === 'fork' ) {
			if( row.input ) addValueSlot( node, row.input, row );
			attachStatements( node, { type:'tab', dir:'statement', name:row.section.name, x:m.barW + pad, y:row.y + m.rowH, section:row.section, entry:row.entry }, row.body );
		}
		if( row.ghost ) for( let i = before; i < node.connectors.length; i++ ) node.connectors[i].ghost = true;
	}

	// ---- labels ------------------------------------------------------------
	for( const row of node.rows ) {
		if( !row.cells ) continue;
		for( const c of row.cells ) {
			if( c.type === 'label' || c.type === 'name' )
				node.labels.push( { text:c.text, x:c.x + m.textPad, y:row.y + ( m.rowH - m.textH )/2, w:c.w - 2*m.textPad, h:m.textH, cell:c, ghost:!!row.ghost } );
		}
	}
	return node;
}

// A stub off the bar ending in a value slot: [bar][ label... ][slot]
function layoutInputRow( section, entry, node, y ) {
	const m = metrics;
	const row = { type:'input', section, entry, y, h:m.rowH, x:0, cells:[], input:null };
	let x = m.barW;
	let textW = 0;
	for( const c of section.cells ) {
		if( c.type === 'input' ) {
			if( textW < m.minFill ) { x += m.minFill - textW; textW = m.minFill; }
			row.input = { type:'input', slot:c.slot, x, y, w:m.slotW, h:m.rowH, child: entry.inputs[c.slot] || null };
			row.cells.push( row.input );
			x += m.slotW;
		} else {
			const text = cellText( c, entry.fields );
			const w = measure( text );
			row.cells.push( { type:c.type, text, field:c.field, x, y, w, h:m.rowH } );
			x += w; textW += w;
		}
	}
	row.w = x;
	row.stubW = x - m.barW;
	// a value plugged in may be taller than the row; the rows below move down
	if( row.input.child ) {
		const child = layoutBlock( row.input.child );
		row.input.childNode = child;
		if( !metrics.liftValues ) row.h = Math.max( row.h, child.stackH );
	}
	return row;
}

// A fork: [bar][fork stub with statement tab][ label... ][slot or end]
//         [bar][   statements hanging from the tab                   ]
function layoutForkRow( section, entry, node, y ) {
	const m = metrics;
	const row = { type:'fork', section, entry, y, h:0, x:0, cells:[], input:null };
	let x = m.barW + m.forkW;
	for( const c of section.cells ) {
		if( c.type === 'statements' ) continue;
		if( c.type === 'input' ) {
			row.input = { type:'input', slot:c.slot, x, y, w:m.slotW, h:m.rowH, child: entry.inputs[c.slot] || null };
			row.cells.push( row.input );
			x += m.slotW;
		} else {
			const text = cellText( c, entry.fields );
			const w = measure( text );
			row.cells.push( { type:c.type, text, field:c.field, x, y, w, h:m.rowH } );
			x += w;
		}
	}
	if( !row.input ) x += m.endW;
	row.w = x;
	row.stubW = x - m.barW;
	row.body = layoutStatements( entry.statements, node, m.barW + pad, y + m.rowH );
	let h = m.rowH + row.body.h + m.forkGap;
	if( row.input && row.input.child ) {
		const child = layoutBlock( row.input.child );
		row.input.childNode = child;
		if( !metrics.liftValues ) h = Math.max( h, child.stackH );
	}
	row.h = h;
	return row;
}

// Statements stacked under a tab: each block's top slot receives the tab of
// the block above, so the stack pitch is simply each block's height.
function layoutStatements( list, node, x, y ) {
	const m = metrics;
	const body = { x, y, h:0, w:0, nodes:[] };
	let cy = y;
	for( const s of list ) {
		const child = layoutBlock( s );
		body.nodes.push( child );
		cy += child.stackH;
		body.w = Math.max( body.w, child.w );
	}
	body.h = Math.max( m.rowH, cy - y ) + m.htabH;   // room for the last tab (or an empty slot)
	return body;
}

function addValueSlot( node, cell, row ) {
	const m = metrics;
	const conn = { type:'slot', dir:'value', name:cell.slot, x:cell.x, y:cell.y + pad, cell, row };
	node.connectors.push( conn );
	if( cell.child ) {
		const child = cell.childNode || layoutBlock( cell.child );
		cell.childNode = child;
		child.x = conn.x + m.vtabW;   // its left tab sits in (or hovers over) the slot
		child.y = conn.y - pad;
		child.lift = m.liftValues ? 1 : 0;
		node.children.push( { node:child, x:child.x, y:child.y, lift:child.lift, via:conn } );
	}
}

function attachStatements( node, tab, body ) {
	node.connectors.push( tab );
	let y = tab.y;
	for( const child of body.nodes ) {
		child.x = tab.x - pad;        // its top slot is carved at x = pad
		child.y = y;
		node.children.push( { node:child, x:child.x, y:child.y, lift:0, via:tab } );
		y += child.stackH;
	}
}

// Walk a layout tree with absolute positions.
function walk( node, fn, ox, oy ) {
	ox = ox || 0; oy = oy || 0;
	fn( node, ox, oy );
	for( const c of node.children ) walk( c.node, fn, ox + c.x, oy + c.y );
}

// Bounding box of a whole tree (children can overhang the parent).
function bounds( node ) {
	const b = { x0:Infinity, y0:Infinity, x1:-Infinity, y1:-Infinity };
	walk( node, ( n, ox, oy )=>{
		b.x0 = Math.min( b.x0, ox - metrics.vtabW );
		b.y0 = Math.min( b.y0, oy );
		b.x1 = Math.max( b.x1, ox + n.w );
		b.y1 = Math.max( b.y1, oy + n.h + metrics.htabH );
	} );
	return b;
}

module.exports = exports = { layoutBlock, metrics, measure, walk, bounds, headerForkSection };
