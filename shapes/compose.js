// Pure shape composition: builds vertex/face lists for the C-beam and
// expressor parts from the primitive pieces in shapes/*.js.
// No three.js dependency, so it can run under node for layout tests.

const consts = require( "./consts.js" );
const tween = require( "./tween.js" );
const inset = require( "./inset.js" );
const hbar_swell = require( "./hbar_swell.js" );
const vbar_swell = require( "./vbar_swell.js" );
const corner = require( "./corners.js" );
const slot = require( "./slot.js" );

function Shape(name) {
	return {
		name : name,
		verts: [], norms:[], pairs:[], faces:[],
		size : { width:0, height:0, depth:consts.peice_depth },
		label: { pos:{ x:0, y:0, z:0, set(x,y,z){ this.x=x; this.y=y; this.z=z; } }, size:{ width:0, height:0 } },
		labels : [],   // { text, pos:{x,y,z}, size:{width,height} } placed by the tiler
		resize : null,
		scaledVert(n,scale) { return this.verts[n]; }
	};
}

function isNaN(x) {
  // Coerce into number
  x = Number(x);
  // if x is NaN, NaN != NaN is true, otherwise it's false
  return x != x;
}
function addShape( dest, source, offset, scale, s2 ) {
	var n;
	var o = { v:dest.verts.length, n:dest.norms.length, p:dest.pairs.length, f:dest.faces.length };
	
	var v = source.verts;

	for( n = 0; n < v.length; n++ ) {
		let vn;
		if( scale )
			vn = source.scaledVert( n, scale, s2 );
		else
			vn = v[n];
		dest.verts.push( { x: offset.x+vn.x, y: offset.y+vn.y, z: offset.z+vn.z} );
	}
	var v = source.norms;
	for( n = 0; n < v.length; n++ ) {
		dest.norms.push( v[n] );
	}
	var v = source.pairs;
	for( n = 0; n < v.length; n++ ) {
		dest.pairs.push( [v[n][0] + o.v, v[n][1]+o.n] );
	}
	var v = source.faces;
	for( n = 0; n < v.length; n++ ) {
		var tmp;
		dest.faces.push( tmp=[v[n][0] + o.p, v[n][1]+o.p, v[n][2]+o.p] );
	}

}

function moveShape( dest, offset ) {
	var n;
	var v = dest.verts;
	for( n = 0; n < v.length; n++ ) {
		v[n].x += offset.x;
		v[n].y += offset.y;
		v[n].z += offset.z;
	}
}

function composeExpressor( variable ) {

	var parts = {
		left : null,
		leftTab : null,
		right: null,
		rightTab : null,
		leftVar : null,
		leftVarTab : null,
		rightVar: null,
		rightVarTab : null,
		middleFill : null,
		middleVarFill : null,
		middleConstVar : null,
	};

	//-------- LEFT TAB
	var shape = parts.leftTab = Shape();
	shape.size.width = consts.vtab_width + consts.swell_pad;
	shape.size.height = consts.top_hbar_height + 2*consts.swell_pad;

	addShape( shape, corner.outer0, {x:0,y:0,z:0} );
	addShape( shape, slot.vert_tab, {x:-(consts.vtab_width),y:0,z:consts.swell_pad} );
	addShape( shape, corner.outer2, {x:0,y:0,z:consts.swell_pad+consts.vtab_height} );
	
	//-------- LEFT
	var shape = parts.left = Shape();
	shape.size.width = consts.swell_pad;
	shape.size.height = consts.top_hbar_height + 2*consts.swell_pad;

	addShape( shape, corner.outer0, {x:0,y:0,z:0} );
	addShape( shape, vbar_swell.left, {x:0,y:0,z:consts.swell_pad}, consts.vtab_height );
	addShape( shape, corner.outer2, {x:0,y:0,z:consts.swell_pad+consts.vtab_height} );

	//-------- RIGHT
	var shape = parts.right = Shape();
	shape.size.width = consts.swell_pad;
	shape.size.height = consts.top_hbar_height + 2*consts.swell_pad;

	addShape( shape, corner.outer1, {x:0,y:0,z:0} );
	addShape( shape, vbar_swell.right, {x:0,y:0,z:consts.swell_pad}, consts.vtab_height );
	addShape( shape, corner.outer3, {x:0,y:0,z:consts.swell_pad+consts.vtab_height} );

	//-------- RIGHT TAB
	var shape = parts.rightTab = Shape();
	shape.size.width = consts.vtab_width + consts.swell_pad;
	shape.size.height = consts.top_hbar_height + 2*consts.swell_pad;

	addShape( shape, corner.outer1, {x:consts.vtab_width,y:0,z:0} );
	addShape( shape, slot.vert_slot, {x:0,y:0,z:consts.swell_pad}, consts.vtab_height );
	addShape( shape, hbar_swell.upper, {x:0,y:0,z:0}, consts.vtab_width );
	addShape( shape, hbar_swell.lower, {x:0,y:0,z:consts.swell_pad+consts.vtab_height}, consts.vtab_width );
	addShape( shape, corner.outer3, {x:consts.vtab_width,y:0,z:consts.swell_pad+consts.vtab_height} );

	//-------- LEFT VAR TAB
	var shape = parts.leftVarTab = Shape();
	shape.size.width = consts.vtab_width + consts.swell_pad;
	shape.size.height = consts.top_hbar_height + 2*consts.swell_pad;

	addShape( shape, corner.outer0, {x:(consts.vtab_width),y:0,z:0} );
	addShape( shape, slot.vert_tab, {x:0,y:0,z:consts.swell_pad} );
	addShape( shape, corner.outer2, {x:(consts.vtab_width),y:0,z:consts.swell_pad+consts.vtab_height} );
	addShape( shape, inset.inset_left, {x:consts.swell_pad+consts.vtab_width,y:0,z:consts.swell_pad} );
	addShape( shape, hbar_swell.upper, {x:consts.swell_pad+consts.vtab_width,y:0,z:0}, consts.inset+consts.inset_pad *2 );
	addShape( shape, hbar_swell.lower, {x:consts.swell_pad+consts.vtab_width,y:0,z:consts.swell_pad+consts.vtab_height}, consts.inset+consts.inset_pad *2 );
	addShape( shape, tween.top_hbar_back, {x:consts.swell_pad+consts.vtab_width,y:0,z:consts.swell_pad}, consts.inset+consts.inset_pad*2 );
	
	//-------- LEFT VAR
	var shape = parts.leftVar = Shape();
	shape.size.width = consts.swell_pad;
	shape.size.height = consts.top_hbar_height + 2*consts.swell_pad;

	addShape( shape, corner.outer0, {x:0,y:0,z:0} );
	addShape( shape, vbar_swell.left, {x:0,y:0,z:consts.swell_pad}, consts.vtab_height );
	addShape( shape, corner.outer2, {x:0,y:0,z:consts.swell_pad+consts.vtab_height} );
	addShape( shape, inset.inset_left, {x:consts.swell_pad,y:0,z:consts.swell_pad} );

	addShape( shape, hbar_swell.upper, {x:consts.swell_pad,y:0,z:0}, consts.inset +consts.inset_pad *2 );
	addShape( shape, hbar_swell.lower, {x:consts.swell_pad,y:0,z:consts.swell_pad+consts.vtab_height}, consts.inset + consts.inset_pad *2 );
	addShape( shape, tween.top_hbar_back, {x:consts.swell_pad,y:0,z:consts.swell_pad}, consts.inset+consts.inset_pad*2 );

	//-------- RIGHT VAR
	var shape = parts.rightVar = Shape();
	shape.size.width = consts.swell_pad;
	shape.size.height = consts.top_hbar_height + 2*consts.swell_pad;

	addShape( shape, corner.outer1, {x:consts.inset+consts.inset_pad*2,y:0,z:0} );
	addShape( shape, vbar_swell.right, {x:consts.inset+consts.inset_pad*2,y:0,z:consts.swell_pad}, consts.vtab_height );
	addShape( shape, corner.outer3, {x:consts.inset+consts.inset_pad*2,y:0,z:consts.swell_pad+consts.vtab_height} );
	addShape( shape, inset.inset_right, {x:0,y:0,z:consts.swell_pad} );
	addShape( shape, hbar_swell.upper, {x:0,y:0,z:0}, consts.inset+consts.inset_pad*2 );
	addShape( shape, hbar_swell.lower, {x:0,y:0,z:consts.swell_pad+consts.vtab_height}, consts.inset+consts.inset_pad*2 );
	addShape( shape, tween.top_hbar_back, {x:0,y:0,z:consts.swell_pad}, consts.inset+consts.inset_pad*2 );

	//-------- RIGHT VAR TAB
	var shape = parts.rightVarTab = Shape();
	shape.size.width = consts.vtab_width + consts.swell_pad;
	shape.size.height = consts.top_hbar_height + 2*consts.swell_pad;

	addShape( shape, corner.outer1, {x:consts.vtab_width + consts.inset+consts.inset_pad*2,y:0,z:0} );
	addShape( shape, slot.vert_slot, {x:consts.inset+consts.inset_pad*2,y:0,z:consts.swell_pad} );
	addShape( shape, corner.outer3, {x:consts.vtab_width+ consts.inset+consts.inset_pad*2,y:0,z:consts.swell_pad+consts.vtab_height } );
	addShape( shape, inset.inset_right, {x:0 ,y:0,z:consts.swell_pad } );
	addShape( shape, hbar_swell.upper, {x:0,y:0,z:0}, consts.vtab_width + consts.inset+consts.inset_pad*2 );
	addShape( shape, hbar_swell.lower, {x:0,y:0,z:consts.swell_pad+consts.vtab_height}, consts.vtab_width + consts.inset+consts.inset_pad*2 );
	addShape( shape, tween.top_hbar_back, {x:0,y:0,z:consts.swell_pad}, consts.inset+consts.inset_pad*2 );

	//-------- MIDDLE FILL
	var shape = parts.middleFill = Shape();
	shape.size.width = consts.unit_length;
	shape.size.height = consts.top_hbar_height + 2*consts.swell_pad;
	addShape( shape, tween.top_hbar, {x:0,y:0,z:consts.swell_pad}, consts.unit_length );
	addShape( shape, hbar_swell.upper, {x:0,y:0,z:0}, consts.unit_length );
	addShape( shape, hbar_swell.lower, {x:0,y:0,z:consts.swell_pad+consts.vtab_height}, consts.unit_length );
	addShape( shape, tween.top_hbar_back, {x:0,y:0,z:consts.swell_pad}, consts.unit_length );
	shape.scaledVert = function (n,scale) { return { x: this.verts[n].x * scale, y:this.verts[n].y, z:this.verts[n].z } }

	//-------- MIDDLE VAR FILL
	var shape = parts.middleVarFill = Shape();
	shape.size.width = consts.unit_length;
	shape.size.height = consts.top_hbar_height + 2*consts.swell_pad;
	addShape( shape, hbar_swell.upper, {x:0,y:0,z:0}, consts.unit_length );
	addShape( shape, hbar_swell.lower, {x:0,y:0,z:consts.swell_pad+consts.vtab_height}, consts.unit_length );
	addShape( shape, inset.inset_fill, {x:0,y:0,z:consts.swell_pad}, consts.unit_length );
	addShape( shape, tween.top_hbar_back, {x:0,y:0,z:consts.swell_pad}, consts.unit_length );
	shape.scaledVert = function (n,scale) { return { x: this.verts[n].x * scale, y:this.verts[n].y, z:this.verts[n].z } }


	//-------- CONST = VAR
	var shape = parts.middleConstVar = Shape();
	shape.size.width = consts.inset + consts.inset_pad*2;
	shape.size.height = consts.top_hbar_height + 2*consts.swell_pad;

	addShape( shape, hbar_swell.upper, {x:0,y:0,z:0}, consts.inset +consts.inset_pad *2 );
	addShape( shape, inset.inset_left, {x:0,y:0,z:consts.swell_pad} );
	addShape( shape, hbar_swell.lower, {x:0,y:0,z:consts.swell_pad+consts.vtab_height}, consts.inset + consts.inset_pad *2 );
	addShape( shape, tween.top_hbar_back, {x:0,y:0,z:consts.swell_pad}, consts.inset + consts.inset_pad *2 );


	const expressorParts = parts;

	var shape = Shape();
	shape.size.width = consts.vtab_width + 2*consts.swell_pad + consts.top_hbar_height;
	shape.size.height = consts.top_hbar_height + 2*consts.swell_pad;
	shape.label.size.width = consts.top_hbar_height - (consts.inset * 2 + consts.inset );
	shape.label.size.height= consts.top_hbar_height - (consts.inset * 2 + consts.inset_pad ) ;
	
	shape.label.pos.set( consts.swell_pad + consts.vtab_width + consts.inset + consts.inset_pad/2,
		consts.peice_depth - consts.inset_depth/2 ,
		consts.swell_pad + consts.inset+ consts.inset_pad/2
	);

	if( variable ) {
		addShape( shape, inset.inset_left, {x:consts.swell_pad,y:0,z:consts.swell_pad}, 2 );
		addShape( shape, inset.inset_right, {x:consts.swell_pad + consts.inset+consts.inset_pad +shape.label.size.width  - consts.inset_pad*2,y:0,z:consts.swell_pad}, 2 );
		addShape( shape, inset.inset_fill, {x:consts.swell_pad + consts.inset+consts.inset_pad*2,y:0,z:consts.swell_pad}, shape.label.size.width - consts.inset_pad*3 );
		addShape( shape, inset.inset_background, {x:consts.swell_pad + consts.inset+consts.inset_pad*2 + consts.inset_pad/2 - (consts.inset+consts.inset_pad),y:0,z:consts.swell_pad}
			, shape.label.size.width + consts.inset_pad
		);
		//addShape( shape, inset.inset_label, {x:consts.swell_pad + consts.inset+consts.inset_pad*2 + consts.inset_pad/2 - (consts.inset+consts.inset_pad),y:0,z:consts.swell_pad}, .5 + (2*consts.inset_pad + 2*consts.inset) + consts.inset_pad/2 );
	} else {
		shape.label.pos.y = consts.peice_depth + consts.inset_depth / 2
		addShape( shape, tween.top_hbar, {x:consts.swell_pad,y:0,z:consts.swell_pad}, shape.label.size.width + consts.inset*2 + consts.inset_pad );
	}

	//addShape( shape, slot.horiz_slot, {x:consts.swell_pad,y:0,z:-consts.htab_height} );
	//addShape( shape, slot.horiz_tab, {x:consts.swell_pad,y:0,z:-consts.swell_pad  -consts.htab_height } );

	addShape( shape, slot.vert_tab, {x:-(consts.vtab_width),y:0,z:consts.swell_pad} );
	addShape( shape, slot.vert_slot, {x:shape.label.size.width + consts.inset*3 + consts.inset_pad,y:0,z:consts.swell_pad} );

	addShape( shape, corner.outer0, {x:0,y:0,z:0} );
	addShape( shape, hbar_swell.upper, {x:consts.swell_pad,y:0,z:0}, shape.label.size.width + consts.inset_pad + consts.inset*2 + consts.vtab_width  );
	addShape( shape, hbar_swell.lower, {x:consts.swell_pad,y:0,z:consts.swell_pad+consts.vtab_height}, shape.label.size.width  + consts.inset_pad + consts.inset*2 + consts.vtab_width );
	addShape( shape, corner.outer1, {x:shape.label.size.width+ consts.vtab_width  + consts.inset*2 + consts.swell_pad + consts.inset_pad,y:0,z:0} );

	addShape( shape, corner.outer2, {x:0,y:0,z:consts.swell_pad+consts.vtab_height} );

	addShape( shape, corner.outer3, {x:shape.label.size.width+ consts.vtab_width  + consts.inset*2 + consts.swell_pad + consts.inset_pad,y:0,z:consts.swell_pad+consts.vtab_height} );

	addShape( shape, tween.top_hbar_back, {x:consts.swell_pad,y:0,z:consts.swell_pad}, shape.label.size.width + consts.inset*2 + consts.inset_pad );

	if( variable ) 
	{
		shape.resize = function( size ) {
			
		}				
		
	}

	moveShape( shape, {x:consts.vtab_width, y:0, z:0 } );
	shape.parts = expressorParts;
	return shape;
}

function composeStatements( input, output ) {
	var shape;
	var parts = {
		forkBegin : { shape:Shape(), geometry:null, mesh: null },
		'continue' : { shape:Shape(), geometry:null, mesh: null },
	}
	
	shape = parts.forkBegin.shape;	
	shape.size.width = consts.swell_pad + consts.htab_width;
	shape.size.height = consts.swell_pad*2 + consts.top_hbar_height;

	addShape( shape, hbar_swell.upper, {x:0,y:0,z:0}, consts.swell_pad*2 + consts.htab_width );
	//addShape( shape, vbar_swell.left, {x:consts.swell_pad,y:0,z:0}, consts.swell_pad*2 + consts.htab_width );
	addShape( shape, hbar_swell.lower_inner_tab, {x:0,y:0,z:consts.swell_pad+consts.top_hbar_height} );

	addShape( shape, slot.horiz_tab, {x:consts.swell_pad,y:0,z:consts.swell_pad+consts.top_hbar_height} );

	addShape( shape, tween.top_hbar, {x:0,y:0,z:consts.swell_pad}, consts.htab_width + consts.swell_pad );
	addShape( shape, tween.top_hbar_back, {x:0,y:0,z:consts.swell_pad}, consts.htab_width + consts.swell_pad );

	shape = parts['continue'].shape;	
	shape.size.width = consts.swell_pad + consts.htab_width;
	shape.size.height = consts.swell_pad*2 + consts.top_hbar_height;
	addShape( shape, corner.outer0, {x:0,y:0,z:0} );
	addShape( shape, slot.horiz_slot, {x:consts.swell_pad,y:0,z:0} );
	addShape( shape, vbar_swell.left, {x:0,y:0,z:consts.swell_pad}, consts.htab_height );
	addShape( shape, slot.horiz_tab, {x:consts.swell_pad+consts.top_hbar_height,y:0,z:0} );
	addShape( shape, corner.outer2, {x:0,y:0,z:consts.swell_pad+consts.top_hbar_height} );
	addShape( shape, tween.hbar_tab, {x:consts.swell_pad,y:0,z:consts.swell_pad+consts.hbar_height}, consts.htab_width + consts.swell_pad );
	addShape( shape, tween.hbar_tab_back, {x:consts.swell_pad,y:0,z:consts.swell_pad}, consts.htab_width + consts.swell_pad );
	return parts;
}

function composeCBeam( input, output ) {
	var shape;
	var parts = {
		ulCornerCallable : { shape:Shape(), geometry:null, mesh: null },
		ulCornerCall : { shape:Shape(), geometry:null, mesh: null },
		// outputs always have value not command....
		ulCornerOutput : { shape:Shape(), geometry:null, mesh: null },
		ulCornerBlock : { shape:Shape(), geometry:null, mesh: null },
		vBarFork : { shape:Shape(), geometry:null, mesh: null },
		vBarTab : { shape:Shape(), geometry:null, mesh: null },
		hBarBottomExtension: { shape:Shape(), geometry:null, mesh: null },
		lowerBar : { shape:Shape(), geometry:null, mesh: null },
		lowerBarCommand : { shape:Shape(), geometry:null, mesh: null },
		lowerBarEnd : { shape:Shape(), geometry:null, mesh: null },
		vBarExtension : { shape:Shape(), geometry:null, mesh: null },
	}

	// --------- CALLABLE -------------
	shape = parts.ulCornerCallable.shape;	

	shape.size.width = consts.swell_pad*2 + consts.vbar_width + consts.htab_width;
	shape.size.height = consts.swell_pad*2 + consts.htab_height + consts.top_hbar_height;

	addShape( shape, corner.outer0, {x:0,y:0,z:0} );
	addShape( shape, hbar_swell.upper, {x:consts.swell_pad,y:0,z:0}, consts.vbar_width + consts.htab_width + consts.swell_pad*2 );
	addShape( shape, vbar_swell.left, {x:0,y:0,z:consts.swell_pad}, consts.top_hbar_height + consts.htab_height + consts.swell_pad );
	addShape( shape, slot.horiz_tab, {x:consts.swell_pad*3 + consts.vbar_width,y:0,z:consts.swell_pad+consts.top_hbar_height} );
	addShape( shape, corner.inner0, {x:consts.swell_pad + consts.vbar_width,y:0,z:consts.swell_pad+consts.top_hbar_height} );
	addShape( shape, hbar_swell.lower_inner_tab, {x:consts.swell_pad*2 + consts.vbar_width,y:0,z:consts.swell_pad+consts.top_hbar_height} );
	addShape( shape, vbar_swell.right, {x:consts.swell_pad + consts.vbar_width,y:0,z:consts.swell_pad + consts.top_hbar_height}, consts.htab_height + consts.swell_pad );
	addShape( shape, tween.top_hbar, {x:consts.swell_pad + consts.vbar_width,y:0,z:consts.swell_pad}, consts.htab_width + consts.swell_pad*2 );
	addShape( shape, tween.top_hbar_back, {x:consts.swell_pad + consts.vbar_width,y:0,z:consts.swell_pad}, consts.htab_width + consts.swell_pad*2 );
	addShape( shape, tween.upper_corner_fill_notab, {x:consts.swell_pad,y:0,z:consts.swell_pad} );
	addShape( shape, tween.upper_corner_fill_notab_back, {x:consts.swell_pad,y:0,z:consts.swell_pad} );
	addShape( shape, tween.vbar, {x:consts.swell_pad,y:0,z:consts.swell_pad + consts.top_hbar_height}, consts.htab_height + consts.swell_pad );
	addShape( shape, tween.vbar_back, {x:consts.swell_pad,y:0,z:consts.swell_pad + consts.top_hbar_height}, consts.htab_height + consts.swell_pad );
	
	
	// --------- CALL -------------
	shape = parts.ulCornerCall.shape;
	shape.size.width = consts.swell_pad + consts.htab_width;
	shape.size.height = consts.swell_pad*2 + consts.top_hbar_height;
	addShape( shape, corner.outer0, {x:0,y:0,z:0} );
	addShape( shape, slot.horiz_slot, {x:consts.swell_pad,y:0,z:0} );
	addShape( shape, corner.outer1, {x:consts.swell_pad+consts.htab_width,y:0,z:0} );

	addShape( shape, vbar_swell.left, {x:0,y:0,z:consts.swell_pad}, consts.top_hbar_height + consts.swell_pad );
	addShape( shape, corner.inner0, {x:consts.swell_pad+consts.vbar_width,y:0,z:consts.swell_pad+consts.top_hbar_height} );

	addShape( shape, hbar_swell.lower, {x:consts.swell_pad*2+consts.vbar_width,y:0,z:consts.swell_pad+consts.top_hbar_height}, consts.htab_width - (consts.vbar_width +consts.swell_pad ) );

	addShape( shape, tween.upper_corner_fill, {x:consts.swell_pad,y:0,z:consts.swell_pad + consts.htab_height} );
	addShape( shape, tween.upper_corner_fill_back, {x:consts.swell_pad,y:0,z:consts.swell_pad+ consts.htab_height} );

	addShape( shape, tween.hbar_tab, {x:consts.swell_pad + consts.vbar_width,y:0,z:consts.swell_pad +consts.htab_height}, consts.htab_width );
	addShape( shape, tween.hbar_tab_back, {x:consts.swell_pad + consts.vbar_width,y:0,z:consts.swell_pad+consts.htab_height}, consts.htab_width );

	addShape( shape, tween.vbar, {x:consts.swell_pad,y:0,z:consts.swell_pad + consts.top_hbar_height}, consts.swell_pad  );
	addShape( shape, tween.vbar_back, {x:consts.swell_pad,y:0,z:consts.swell_pad + consts.top_hbar_height}, consts.swell_pad );

	// --------- BLOCK  -----------
	shape = parts.ulCornerBlock.shape;

	shape.size.width = consts.swell_pad*2 + consts.vbar_width + consts.htab_width;
	shape.size.height = consts.swell_pad*2 + consts.htab_height + consts.top_hbar_height;

	addShape( shape, corner.outer0, {x:0,y:0,z:0} );
	addShape( shape, slot.horiz_slot, {x:consts.swell_pad,y:0,z:0} );
	addShape( shape, hbar_swell.upper, {x:consts.swell_pad+consts.htab_width,y:0,z:0}, consts.vbar_width + consts.swell_pad );

	addShape( shape, vbar_swell.left, {x:0,y:0,z:consts.swell_pad}, consts.top_hbar_height + consts.swell_pad + consts.htab_height );
	addShape( shape, corner.inner0, {x:consts.swell_pad+consts.vbar_width,y:0,z:consts.swell_pad+consts.top_hbar_height} );
	addShape( shape, corner.inner1, {x:consts.swell_pad+consts.vbar_width,y:0,z:consts.swell_pad*2+consts.top_hbar_height} );

	addShape( shape, slot.horiz_tab, {x:consts.swell_pad*2+consts.vbar_width,y:0,z:consts.swell_pad+consts.top_hbar_height} );
	addShape( shape, vbar_swell.right, {x:consts.swell_pad+consts.vbar_width,y:0,z:consts.swell_pad*2+consts.top_hbar_height}, consts.htab_height );


	addShape( shape, tween.upper_corner_fill, {x:consts.swell_pad,y:0,z:consts.swell_pad + consts.htab_height} );
	addShape( shape, tween.upper_corner_fill_back, {x:consts.swell_pad,y:0,z:consts.swell_pad+ consts.htab_height} );

	addShape( shape, tween.hbar_tab, {x:consts.swell_pad + consts.vbar_width,y:0,z:consts.swell_pad +consts.htab_height}, consts.htab_width );
	addShape( shape, tween.hbar_tab_back, {x:consts.swell_pad + consts.vbar_width,y:0,z:consts.swell_pad+consts.htab_height}, consts.htab_width );

	addShape( shape, tween.vbar, {x:consts.swell_pad,y:0,z:consts.swell_pad + consts.top_hbar_height}, consts.htab_height + consts.swell_pad  );
	addShape( shape, tween.vbar_back, {x:consts.swell_pad,y:0,z:consts.swell_pad + consts.top_hbar_height}, consts.vtab_height + consts.swell_pad * 3 );

	addShape( shape, tween.top_hbar, {x:consts.swell_pad +consts.htab_width,y:0,z:consts.swell_pad}, consts.vbar_width +consts.swell_pad);
	addShape( shape, tween.top_hbar_back, {x:consts.swell_pad +consts.htab_width,y:0,z:consts.swell_pad}, consts.vbar_width+consts.swell_pad );
	

	// --------- OUTPUT (COMBINED EXPRESSION) -------------
	shape = parts.ulCornerOutput.shape;

	shape.size.width = consts.swell_pad*2 + consts.vbar_width;// + consts.vtab_width;
	shape.size.height = consts.swell_pad*2 + consts.top_hbar_height;

	addShape( shape, corner.outer0, {x:0,y:0,z:0} );
	addShape( shape, hbar_swell.upper, {x:consts.swell_pad,y:0,z:0}, consts.vbar_width + consts.swell_pad );
	addShape( shape, slot.vert_tab, {x:-consts.vtab_width,y:0,z:consts.swell_pad}, consts.top_hbar_height + consts.htab_height + consts.swell_pad );

	addShape( shape, vbar_swell.left, {x:0,y:0,z:consts.swell_pad + consts.vtab_height}, consts.swell_pad );

	addShape( shape, corner.inner0, {x:consts.swell_pad+consts.vbar_width,y:0,z:consts.swell_pad+consts.top_hbar_height} );

	addShape( shape, tween.top_hbar, {x:consts.swell_pad + consts.vbar_width,y:0,z:consts.swell_pad}, consts.swell_pad );
	addShape( shape, tween.top_hbar_back, {x:consts.swell_pad + consts.vbar_width,y:0,z:consts.swell_pad}, consts.swell_pad );

	addShape( shape, tween.upper_corner_fill_notab, {x:consts.swell_pad,y:0,z:consts.swell_pad} );
	addShape( shape, tween.upper_corner_fill_notab_back, {x:consts.swell_pad,y:0,z:consts.swell_pad} );
	addShape( shape, tween.vbar, {x:consts.swell_pad,y:0,z:consts.swell_pad + consts.top_hbar_height}, consts.swell_pad  );
	addShape( shape, tween.vbar_back, {x:consts.swell_pad,y:0,z:consts.swell_pad + consts.top_hbar_height}, consts.swell_pad );

	//moveShape( shape, {x:consts.vtab_width, y:0, z:0 } );
	
	// --------- VERTICAL BAR INPUT TAB -------------
	shape = parts.vBarTab.shape;
	shape.size.width = consts.swell_pad*2 + consts.vbar_width + consts.vtab_width;
	shape.size.height = consts.swell_pad*2 + consts.vtab_height;

	addShape( shape, vbar_swell.left, {x:0,y:0,z:0}, consts.vtab_height + consts.swell_pad*2 );

	addShape( shape, tween.vbar, {x:consts.swell_pad,y:0,z:0}, consts.vtab_height + consts.swell_pad*2  );
	addShape( shape, tween.vbar_back, {x:consts.swell_pad,y:0,z:0}, consts.vtab_height + consts.swell_pad*2 );
	
	addShape( shape, corner.inner1, {x:consts.swell_pad+consts.vbar_width,y:0,z:0} );
	addShape( shape, hbar_swell.upper, {x:consts.swell_pad*2+consts.vbar_width,y:0,z:0}, consts.vtab_width - consts.swell_pad );
	addShape( shape, corner.outer1, {x:consts.swell_pad+consts.vbar_width + consts.vtab_width,y:0,z:0} );
	addShape( shape, corner.outer3, {x:consts.swell_pad+consts.vbar_width + consts.vtab_width,y:0,z:consts.vtab_height + consts.swell_pad} );
	addShape( shape, slot.vert_slot, {x:consts.swell_pad+consts.vbar_width,y:0,z:consts.swell_pad} );
	addShape( shape, hbar_swell.lower, {x:consts.swell_pad*2+consts.vbar_width,y:0,z: consts.swell_pad+consts.top_hbar_height}, consts.vtab_width - consts.swell_pad );
	addShape( shape, corner.inner0, {x:consts.swell_pad+consts.vbar_width,y:0,z:consts.vtab_height + consts.swell_pad} );

	// --------- VERTICAL BAR FORK -------------
	shape = parts.vBarFork.shape;
	shape.size.width = consts.swell_pad*2 + consts.vbar_width;
	shape.size.height = consts.swell_pad*2 + consts.vtab_height;

	addShape( shape, vbar_swell.left, {x:0,y:0,z:0}, consts.vtab_height + consts.swell_pad*2 );

	addShape( shape, tween.vbar, {x:consts.swell_pad,y:0,z:0}, consts.vtab_height + consts.swell_pad*2  );
	addShape( shape, tween.vbar_back, {x:consts.swell_pad,y:0,z:0}, consts.vtab_height + consts.swell_pad*2 );

	addShape( shape, tween.top_hbar, {x:consts.swell_pad+consts.vbar_width,y:0,z:consts.swell_pad}, consts.swell_pad  );
	addShape( shape, tween.top_hbar_back, {x:consts.swell_pad+consts.vbar_width,y:0,z:consts.swell_pad}, consts.swell_pad );
	
	addShape( shape, corner.inner1, {x:consts.swell_pad+consts.vbar_width,y:0,z:0} );
	//addShape( shape, hbar_swell.upper, {x:consts.swell_pad*2+consts.vbar_width,y:0,z:0}, consts.vtab_width - consts.swell_pad );
	//addShape( shape, corner.outer1, {x:consts.swell_pad+consts.vbar_width + consts.vtab_width,y:0,z:0} );
	//addShape( shape, corner.outer3, {x:consts.swell_pad+consts.vbar_width + consts.vtab_width,y:0,z:consts.vtab_height + consts.swell_pad} );
	//addShape( shape, slot.vert_slot, {x:consts.swell_pad+consts.vbar_width,y:0,z:consts.swell_pad} );
	//addShape( shape, hbar_swell.lower, {x:consts.swell_pad*2+consts.vbar_width,y:0,z: consts.swell_pad+consts.top_hbar_height}, consts.vtab_width - consts.swell_pad );
	addShape( shape, corner.inner0, {x:consts.swell_pad+consts.vbar_width,y:0,z:consts.vtab_height + consts.swell_pad} );

	
	// --------- LOWER BAR CORNER -------------
	shape = parts.lowerBar.shape;
	shape.size.width = consts.swell_pad*2 + consts.vbar_width;
	shape.size.height = consts.swell_pad*2 + consts.bot_hbar_height;
	addShape( shape, vbar_swell.left, {x:0,y:0,z:0}, consts.swell_pad+consts.bot_hbar_height);
	addShape( shape, corner.outer2, {x:0,y:0,z:consts.swell_pad+consts.bot_hbar_height} );
	addShape( shape, corner.inner1, {x:consts.swell_pad+consts.vbar_width,y:0,z:0} );
	//addShape( shape, hbar_swell.upper, {x:consts.swell_pad,y:0,z:0}, consts. );
	addShape( shape, hbar_swell.lower, {x:consts.swell_pad,y:0,z:consts.swell_pad+consts.bot_hbar_height}, consts.vbar_width + consts.swell_pad );

	addShape( shape, tween.lower_corner_fill, {x:consts.swell_pad,y:0,z:consts.swell_pad} );
	addShape( shape, tween.lower_corner_fill_back, {x:consts.swell_pad,y:0,z:consts.swell_pad} );
	addShape( shape, tween.bot_hbar, {x:consts.swell_pad + consts.vbar_width,y:0,z:consts.swell_pad}, consts.swell_pad );
	addShape( shape, tween.bot_hbar_back, {x:consts.swell_pad + consts.vbar_width,y:0,z:consts.swell_pad}, consts.swell_pad );
	addShape( shape, tween.vbar, {x:consts.swell_pad,y:0,z:0}, consts.swell_pad );
	addShape( shape, tween.vbar_back, {x:consts.swell_pad,y:0,z:0}, consts.swell_pad );

	// --------- LOWER BAR COMMAND -------------
	shape = parts.lowerBarCommand.shape;
	shape.size.width = consts.swell_pad + consts.htab_width;
	shape.size.height = consts.swell_pad*2 + consts.bot_hbar_height + consts.htab_height;
	addShape( shape, corner.inner1, {x:consts.swell_pad+consts.vbar_width,y:0,z:0} );
	addShape( shape, vbar_swell.left, {x:0,y:0,z:0}, consts.swell_pad+consts.bot_hbar_height);
	addShape( shape, hbar_swell.upper, {x:consts.swell_pad*2+consts.vbar_width,y:0,z:0}, consts.htab_width - ( consts.swell_pad + consts.vbar_width ) );
	addShape( shape, corner.outer2, {x:0,y:0,z:consts.swell_pad+consts.bot_hbar_height} );
	addShape( shape, slot.horiz_tab, {x:consts.swell_pad,y:0,z:consts.swell_pad+consts.bot_hbar_height} );

	addShape( shape, tween.lower_corner_fill, {x:consts.swell_pad,y:0,z:consts.swell_pad} );
	addShape( shape, tween.lower_corner_fill_back, {x:consts.swell_pad,y:0,z:consts.swell_pad} );
	addShape( shape, tween.bot_hbar, {x:consts.swell_pad + consts.vbar_width,y:0,z:consts.swell_pad}, consts.htab_width - consts.vbar_width );
	addShape( shape, tween.bot_hbar_back, {x:consts.swell_pad + consts.vbar_width,y:0,z:consts.swell_pad}, consts.htab_width - consts.vbar_width );

	addShape( shape, tween.vbar, {x:consts.swell_pad,y:0,z:0}, consts.swell_pad );
	addShape( shape, tween.vbar_back, {x:consts.swell_pad,y:0,z:0}, consts.swell_pad );

	// --------- LOWER BAR END -------------
	shape = parts.lowerBarEnd.shape;
	shape.size.width = consts.swell_pad;
	shape.size.height = consts.swell_pad*2 + consts.bot_hbar_height;
	addShape( shape, corner.outer1, {x:0,y:0,z:0} );
	addShape( shape, vbar_swell.right, {x:0,y:0,z:consts.swell_pad}, consts.bot_hbar_height );
	addShape( shape, corner.outer3, {x:0,y:0,z:consts.bot_hbar_height+consts.swell_pad} );

	// --------- VERT BAR TWEEN -------------
	shape = parts.vBarExtension.shape;
	shape.size.width = consts.vbar_width + 2*consts.swell_pad;
	shape.size.height = consts.unit_length;
	addShape( shape, vbar_swell.left, {x:0,y:0,z:0}, consts.unit_length );
	addShape( shape, vbar_swell.right, {x:consts.swell_pad+consts.vbar_width,y:0,z:0}, consts.unit_length );
	addShape( shape, tween.vbar, {x:consts.swell_pad,y:0,z:0}, consts.unit_length  );
	addShape( shape, tween.vbar_back, {x:consts.swell_pad,y:0,z:0}, consts.unit_length );

	shape.scaledVert = function (n,scale) { return { x: this.verts[n].x, y:this.verts[n].y, z:this.verts[n].z * scale } }

	// --------- HOR BAR BOTTOM TWEEN -------------
	shape = parts.hBarBottomExtension.shape;
	shape.size.width = consts.unit_length;
	shape.size.height = consts.bot_hbar_height + 2*consts.swell_pad;

	addShape( shape, tween.bot_hbar, {x:0,y:0,z:consts.swell_pad}, consts.unit_length );
	addShape( shape, hbar_swell.upper, {x:0,y:0,z:0}, consts.unit_length );
	addShape( shape, hbar_swell.lower, {x:0,y:0,z:consts.swell_pad+consts.bot_hbar_height}, consts.unit_length );
	addShape( shape, tween.bot_hbar_back, {x:0,y:0,z:consts.swell_pad}, consts.unit_length );
	shape.scaledVert = function (n,scale) { return { x: this.verts[n].x * scale, y:this.verts[n].y, z:this.verts[n].z } }



	return parts;		
}

module.exports = exports = {
	consts, tween, inset, hbar_swell, vbar_swell, corner, slot,
	Shape, addShape, moveShape,
	composeExpressor, composeStatements, composeCBeam,
};
