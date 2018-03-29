
//const _THREE = window.THREE;
const consts = require( "./shapes/consts.js" );
const tween = require( "./shapes/tween.js" );
const inset = require( "./shapes/inset.js" );
const hbar_swell = require( "./shapes/hbar_swell.js" );
const vbar_swell = require( "./shapes/vbar_swell.js" );
const corner = require( "./shapes/corners.js" );
const slot = require( "./shapes/slot.js" );

const shapes = {
	expressor : null,
	cBeam : null,
	Shape : Shape,
	addShape : addShape,
	createGeometry : createGeometry,
	createMesh : createMesh,
	makeText : makeText,
	expressorParts : null,
	statementParts : null,
	CBeam : null,
	makeCallBlock : makeCallBlock,
	makeSwitchBlock : makeSwitchBlock,
	makeObjectBlock : makeObjectBlock,
	keywords : {
		
	}
}

function Shape(name) {
	return {
		verts: [], norms:[], pairs:[], faces:[],
		size : { width:0, height:0, depth:consts.peice_depth },
		label: { pos:new THREE.Vector3(), size:{ width:0, height:0 } },
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


	shapes.expressorParts = parts;

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




	parts.ulCornerCallable.geometry = createGeometry(  parts.ulCornerCallable.shape );
	parts.ulCornerCallable.mesh = createMesh(  parts.ulCornerCallable.geometry );
	parts.ulCornerCall.geometry = createGeometry(  parts.ulCornerCall.shape );
	parts.ulCornerCall.mesh = createMesh(  parts.ulCornerCall.geometry );

	parts.ulCornerOutput.geometry = createGeometry(  parts.ulCornerOutput.shape );
	parts.ulCornerOutput.mesh = createMesh(  parts.ulCornerOutput.geometry );

	parts.ulCornerBlock.geometry = createGeometry(  parts.ulCornerBlock.shape );
	parts.ulCornerBlock.mesh = createMesh(  parts.ulCornerBlock.geometry );

	parts.vBarFork.geometry = createGeometry(  parts.vBarFork.shape );
	parts.vBarFork.mesh = createMesh(  parts.vBarFork.geometry );

	parts.vBarTab.geometry = createGeometry(  parts.vBarTab.shape );
	parts.vBarTab.mesh = createMesh(  parts.vBarTab.geometry );


	parts.hBarBottomExtension.geometry = createGeometry(  parts.hBarBottomExtension.shape );
	parts.hBarBottomExtension.mesh = createMesh(  parts.hBarBottomExtension.geometry );

	parts.lowerBar.geometry = createGeometry(  parts.lowerBar.shape );
	parts.lowerBar.mesh = createMesh(  parts.lowerBar.geometry );

	parts.lowerBarCommand.geometry = createGeometry(  parts.lowerBarCommand.shape );
	parts.lowerBarCommand.mesh = createMesh(  parts.lowerBarCommand.geometry );

	parts.lowerBarEnd.geometry = createGeometry(  parts.lowerBarEnd.shape );
	parts.lowerBarEnd.mesh = createMesh(  parts.lowerBarEnd.geometry );

	parts.vBarExtension.geometry = createGeometry(  parts.vBarExtension.shape );
	parts.vBarExtension.mesh = createMesh(  parts.vBarExtension.geometry );
	
	return parts;		
}

function makeCallBlock( ) {
	// --------- A WHOLE CALLABLE BLOCK -------------
	var shape = Shape();

	//addShape( shape, shapes.expressorParts.middleConstVar, {x:shapes.CBeam.ulCornerCall.shape.size.width,y:0,z:0}, 2 );
	//addShape( shape, shapes.expressorParts.middleVarFill, {x:shapes.CBeam.ulCornerCall.shape.size.width,y:0,z:0}, 2 );
	//addShape( shape, shapes.expressorParts.rightVar, {x:shapes.CBeam.ulCornerCall.shape.size.width + 2,y:0,z:0} );


	addShape( shape, shapes.expressorParts.middleFill, {x:shapes.CBeam.ulCornerCall.shape.size.width,y:0,z:0}, 2 );
	addShape( shape, shapes.expressorParts.right, {x:shapes.CBeam.ulCornerCall.shape.size.width + 2,y:0,z:0} );

	addShape( shape, shapes.CBeam.ulCornerCall.shape, {x:0,y:0,z:0} );
	addShape( shape, shapes.CBeam.vBarTab.shape, {x:0,y:0,z:shapes.CBeam.ulCornerCall.shape.size.height} );

	addShape( shape, shapes.CBeam.lowerBarCommand.shape, {x:0,y:0,z:shapes.CBeam.ulCornerCall.shape.size.height + shapes.CBeam.vBarFork.shape.size.height } );
	addShape( shape, shapes.CBeam.hBarBottomExtension.shape, {x:shapes.CBeam.lowerBarCommand.shape.size.width,y:0,z:shapes.CBeam.ulCornerCall.shape.size.height + shapes.CBeam.vBarFork.shape.size.height }, 2 );
	addShape( shape, shapes.CBeam.lowerBarEnd.shape, {x:shapes.CBeam.lowerBarCommand.shape.size.width + 2,y:0,z:shapes.CBeam.ulCornerCall.shape.size.height + shapes.CBeam.vBarFork.shape.size.height } );
	return shape;		
}

function makeSwitchBlock( ) {
	// --------- A WHOLE CALLABLE BLOCK -------------
	var shape = Shape();

	//addShape( shape, shapes.expressorParts.middleConstVar, {x:shapes.CBeam.ulCornerBlock.shape.size.width,y:0,z:0}, 2 );
	//addShape( shape, shapes.expressorParts.middleVarFill, {x:shapes.CBeam.ulCornerBlock.shape.size.width,y:0,z:0}, 2 );
	//addShape( shape, shapes.expressorParts.rightVar, {x:shapes.CBeam.ulCornerBlock.shape.size.width + 2,y:0,z:0} );

	var cursor = { x:0, y:0 };
	addShape( shape, shapes.expressorParts.middleFill, {x:shapes.CBeam.ulCornerBlock.shape.size.width,y:0,z:0}, 2 );
	addShape( shape, shapes.expressorParts.rightTab, {x:shapes.CBeam.ulCornerBlock.shape.size.width + 2,y:0,z:0} );

	addShape( shape, shapes.CBeam.ulCornerBlock.shape, {x:0,y:0,z:0} );
	cursor.x += shapes.CBeam.ulCornerBlock.shape.size.width;
	cursor.y += shapes.CBeam.ulCornerBlock.shape.size.height;
	addShape( shape, shapes.CBeam.vBarExtension.shape, {x:0,y:0,z:cursor.y}, consts.top_hbar_height + consts.swell_pad*2 );

	
	cursor.y += consts.top_hbar_height + consts.swell_pad*2;
	addShape( shape, shapes.CBeam.vBarFork.shape, {x:0,y:0,z:cursor.y} );
	addShape( shape, shapes.statementParts.forkBegin.shape, {x:shapes.CBeam.vBarExtension.shape.size.width,y:0,z:cursor.y}, consts.top_hbar_height + consts.swell_pad*2 );
	addShape( shape, shapes.expressorParts.rightTab, {x:shapes.CBeam.vBarExtension.shape.size.width + shapes.statementParts.forkBegin.shape.size.width,y:0,z:cursor.y}, consts.top_hbar_height + consts.swell_pad*2 );
	cursor.y += shapes.CBeam.vBarFork.shape.size.height;
	addShape( shape, shapes.CBeam.vBarExtension.shape, {x:0,y:0,z:cursor.y}, consts.top_hbar_height + consts.swell_pad*2 );
	cursor.y += consts.top_hbar_height + consts.swell_pad*2;

	addShape( shape, shapes.CBeam.vBarFork.shape, {x:0,y:0,z:cursor.y} );
	addShape( shape, shapes.statementParts.forkBegin.shape, {x:shapes.CBeam.vBarExtension.shape.size.width,y:0,z:cursor.y}, consts.top_hbar_height + consts.swell_pad*2 );
	addShape( shape, shapes.expressorParts.rightTab, {x:shapes.CBeam.vBarExtension.shape.size.width + shapes.statementParts.forkBegin.shape.size.width,y:0,z:cursor.y}, consts.top_hbar_height + consts.swell_pad*2 );
	cursor.y += shapes.CBeam.vBarFork.shape.size.height;

	addShape( shape, shapes.CBeam.vBarExtension.shape, {x:0,y:0,z:cursor.y}, consts.top_hbar_height + consts.swell_pad*2 );
	cursor.y += consts.top_hbar_height + consts.swell_pad*2;
	

	addShape( shape, shapes.CBeam.lowerBarCommand.shape, {x:0,y:0,z:cursor.y } );
	addShape( shape, shapes.CBeam.hBarBottomExtension.shape, {x:shapes.CBeam.lowerBarCommand.shape.size.width,y:0,z:cursor.y }, 2 );
	addShape( shape, shapes.CBeam.lowerBarEnd.shape, {x:shapes.CBeam.lowerBarCommand.shape.size.width + 2,y:0,z:cursor.y } );
	return shape;		
}

function makeObjectBlock( ) {
	// --------- A WHOLE CALLABLE BLOCK -------------
	var shape = Shape();

	//addShape( shape, shapes.expressorParts.middleConstVar, {x:shapes.CBeam.ulCornerBlock.shape.size.width,y:0,z:0}, 2 );
	//addShape( shape, shapes.expressorParts.middleVarFill, {x:shapes.CBeam.ulCornerBlock.shape.size.width,y:0,z:0}, 2 );
	//addShape( shape, shapes.expressorParts.rightVar, {x:shapes.CBeam.ulCornerBlock.shape.size.width + 2,y:0,z:0} );

	var cursor = { x:0, y:0 };
	addShape( shape, shapes.expressorParts.middleFill, {x:shapes.CBeam.ulCornerOutput.shape.size.width,y:0,z:0}, 2 );
	addShape( shape, shapes.expressorParts.rightTab, {x:shapes.CBeam.ulCornerOutput.shape.size.width + 2,y:0,z:0} );

	addShape( shape, shapes.CBeam.ulCornerOutput.shape, {x:0,y:0,z:0} );
	cursor.x += shapes.CBeam.ulCornerOutput.shape.size.width;
	cursor.y += shapes.CBeam.ulCornerOutput.shape.size.height;
	addShape( shape, shapes.CBeam.vBarTab.shape, {x:0,y:0,z:cursor.y} );
	cursor.y += shapes.CBeam.vBarTab.shape.size.height;
	addShape( shape, shapes.CBeam.vBarTab.shape, {x:0,y:0,z:cursor.y} );
	cursor.y += shapes.CBeam.vBarTab.shape.size.height;
	addShape( shape, shapes.CBeam.vBarTab.shape, {x:0,y:0,z:cursor.y} );
	cursor.y += shapes.CBeam.vBarTab.shape.size.height;
	addShape( shape, shapes.CBeam.vBarTab.shape, {x:0,y:0,z:cursor.y} );
	cursor.y += shapes.CBeam.vBarTab.shape.size.height;


	addShape( shape, shapes.CBeam.lowerBar.shape, {x:0,y:0,z:cursor.y } );
	addShape( shape, shapes.CBeam.hBarBottomExtension.shape, {x:shapes.CBeam.lowerBar.shape.size.width,y:0,z:cursor.y }, 2 );
	addShape( shape, shapes.CBeam.lowerBarEnd.shape, {x:shapes.CBeam.lowerBar.shape.size.width + 2,y:0,z:cursor.y } );
	return shape;		
}


function makeText( parent, t, color, v )
{

	let canvas1 = document.createElement('canvas');
	let context1 = canvas1.getContext('2d');

	let sw = v.size.width;
	let sh = v.size.height;//metrics.emHeightAscent - metrics.emHeightDescent

	let w = 40;//metrics.width 
	let h = 40;//metrics.emHeightAscent - metrics.emHeightDescent
	canvas1.height = 40;//consts.top_hbar_height - ( consts.inset*2 +consts.inset_pad );
	canvas1.width = w;//consts.top_hbar_height - ( consts.inset*2 +consts.inset_pad );
	let bl = ( ( canvas1.height / 2 ) + h/2 ) + 0;//metrics.emHeightDescent;

	context1.textBaseLine = bl;


	context1.font = "Bold 30px Arial";
	let metrics = context1.measureText( t );
	//console.log( "width of text is:", metrics.width, t );
	w = canvas1.width = 60;//metrics.width + 20;
	context1.font = "Bold 30px Arial";

	//context1.fillStyle = "rgba(0,0,255,0.3)";
	//context1.fillRect( 0, 0, w, h ); 

	context1.fillStyle = color;//"black";
	context1.fillText(t, canvas1.width/2-metrics.width/2, 30);

	//window.document.body.appendChild( canvas1 );

	// canvas contents will be used for a texture
	let texture1 = new THREE.Texture(canvas1)
	texture1.needsUpdate = true;
	// default is currently THREE.MipMapNearestFilter
	texture1.minFilter = THREE.NearestFilter;

	let material1 = new THREE.MeshBasicMaterial( {map: texture1
		//, side:THREE.DoubleSide
		, transparent:true
		} );

	//material1.transparent = true;
	//material1.depthWrite = false;

	var mesh1 = new THREE.Mesh(
		new THREE.PlaneGeometry(sw, sh),
		material1
	);
	if( v )
		mesh1.position.set( v.pos.x + sw/2, v.pos.y, v.pos.z+sh/2 );
	else
		mesh1.position.set(0,1,0);
	mesh1.rotateX( -Math.PI/2 );
	if( parent )
		parent.add( mesh1 );
	return mesh1;
}

function recomputeText( t ) {

	let metrics = canvas.ctx.measureText( t.text );
	let w, h;
	w = t.canvas.width = metrics.width + 20;

	t.ctx.font = "Bold 30px Arial";
	

	t.texture.needsUpdate = true;
	
}

function addVarText( t, char ) {
	var sourceChar = char;

	if( char == '\b' ) {
		if( t.text.length > 0 ) 
			t.text = t.text.substr( 0, t.text.length-1 );
	} else if( char === ' ' ){
		if( isString )
			t.text += ' ';
		else
			t.shift_toggle = true;
	} else if( Array.isArray( char ) ) {
		if( t.shift_toggle )
			t.text += sourceChar[1];
		else
			t.text += sourceChar[0];
	} else
		t.text += char;
	recomputeText( t );
}

function makeVarText( parent, color, v, isString )
{
	let canvas = {
		canvas : document.createElement('canvas'),
		ctx : null,
		text : "",
		shift_toggle : false,
		isString : isString,
		color : color,
		texture : null,
		material : null,
		mesh : null,
		parentShape : null,
		label : v		
	}	
	canvas.ctx = canvas.canvas.getContext('2d' );

	let sw = v.size.width;
	let sh = v.size.height;//metrics.emHeightAscent - metrics.emHeightDescent

	let w = 40;//metrics.width 
	let h = 40;//metrics.emHeightAscent - metrics.emHeightDescent
	canvas.canvas.height = 40;//consts.top_hbar_height - ( consts.inset*2 +consts.inset_pad );
	canvas.canvas.width = w;//consts.top_hbar_height - ( consts.inset*2 +consts.inset_pad );
	let bl = ( ( canvas.canvas.height / 2 ) + h/2 ) + 0;//metrics.emHeightDescent;

	canvas.ctx.textBaseLine = bl;

	canvas.ctx.font = "Bold 30px Arial";
	let metrics = canvas.ctx.measureText( t );
	console.log( "width of text is:", metrics.width, t );
	w = canvas.canvas.width = metrics.width + 20;
	canvas.ctx.font = "Bold 30px Arial";

	//canvas.ctx.fillStyle = "rgba(0,0,255,0.3)";
	//canvas.ctx.fillRect( 0, 0, w, h ); 

	canvas.ctx.fillStyle = color;//"black";
	canvas.ctx.fillText(t, canvas.canvas.width/2-metrics.width/2, 30);

	//window.document.body.appendChild( canvas.canvas );

	// canvas contents will be used for a texture
	canvas.texture = new THREE.Texture(canvas.canvas)
	canvas.texture.needsUpdate = true;
	// default is currently THREE.MipMapNearestFilter
	canvas.texture.minFilter = THREE.NearestFilter;

	canvas.material = new THREE.MeshBasicMaterial( {map: canvas.texture
		//, side:THREE.DoubleSide
		, transparent:true
		} );

	//material1.transparent = true;
	//material1.depthWrite = false;

	canvas.mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(sw, sh),
		canvas.material
	);
	if( v )
		canvas.mesh.position.set( v.pos.x + sw/2, v.pos.y, v.pos.z+sh/2 );
	else
		canvas.mesh.position.set(0,1,0);
	canvas.mesh.rotateX( -Math.PI/2 );
	if( parent )
		parent.add( canvas.mesh );
	return canvas;
}

function updateGeometry( geometry ) {
	let verts = geometry.vertices;
	let srcverts = geometry.shape.verts;
	for( n = 0; n < verts.length; n++ ) {
		vertes[n].copy( srcverts[n] );
	}
	geometry.verticesNeedUpdate = true;
	geometry.computeBoundingSphere();
}

function createGeometry( shape ) {

	var color = new THREE.Color( 0xffaa00 ); //optional
	//var materialIndex = 0; //optional

	var geometry = new THREE.Geometry();

	var n;
	for( n = 0; n < shape.verts.length; n++ ) {
		geometry.vertices.push( 
			new THREE.Vector3().copy( shape.verts[n] )  
		);
	}

	//create a new face using vertices 0, 1, 2
	var pairs = shape.pairs;
	for( n = 0; n < shape.faces.length; n++ ) {
		var faces = shape.faces[n];
		//console.log( "face:" + face );		
		var face = new THREE.Face3( pairs[faces[0]][0], pairs[faces[1]][0], pairs[faces[2]][0]
				, [new THREE.Vector3().copy( shape.norms[pairs[faces[0]][1]] )
				, new THREE.Vector3().copy( shape.norms[pairs[faces[1]][1]] )
				, new THREE.Vector3().copy( shape.norms[pairs[faces[2]][1]] )
				 ], color );
		geometry.faces.push( face );
	}

	geometry.computeBoundingSphere();
	geometry.shape = shape;
	return geometry;
}

function createMesh( geometry ) {
	if( !shapes.defaultMaterial )
		shapes.defaultMaterial = new THREE.MeshStandardMaterial( { color: 0xAAAAAA, roughness:0.17, metalness:0.24  } );
	var mesh = new THREE.Mesh( geometry, shapes.defaultMaterial );
	return mesh;
}

function init() {
	
	shapes.expressorConst = composeExpressor(0);
	shapes.expressor = composeExpressor(1);
	shapes.expressorConstGeometry = createGeometry( shapes.expressorConst );
	shapes.expressorGeometry = createGeometry( shapes.expressor );
	shapes.expressorConstMesh = createMesh( shapes.expressorConstGeometry );
	shapes.expressorMesh = createMesh( shapes.expressorGeometry );
	
	shapes.CBeam = composeCBeam();
	shapes.statementParts = composeStatements();
		
	var keys = Object.keys( consts.keywords );
	var n;
	var keywordColor = "rgba( 255,255,255,1.0 )";
	for( n = 0; n < keys.length; n++ ) {
		shapes.keywords[keys[n]] = { label : makeText( null, consts.keywords[keys[n]].text, keywordColor, shapes.expressorConst.label )
				, mesh : null }
	}
	for( n = 0; n < keys.length; n++ ) {
		var o = ( shapes.keywords[keys[n]].mesh = new THREE.Object3D() );
		o.add( shapes.keywords[keys[n]].label );
		o.add( shapes.expressorConstMesh.clone() );
	}
}

init();
Object.freeze( shapes );	
module.exports = exports = shapes;
