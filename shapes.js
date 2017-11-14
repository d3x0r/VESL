
const THREE = require( "three" );
const consts = require( "./shapes/consts.js" );
const tween = require( "./shapes/tween.js" );
const inset = require( "./shapes/inset.js" );
const hbar_swell = require( "./shapes/hbar_swell.js" );
const vbar_swell = require( "./shapes/vbar_swell.js" );
const corner = require( "./shapes/corners.js" );
const slot = require( "./shapes/slot.js" );

const shapes {
	c_ul:coner.outer0,
	c_ur:coner.outer1,
	c_ll:coner.outer2,
	c_lr:coner.outer3,
	i_ul:coner.inner0,
	i_ll:coner.inner1,
	
	
}

function Shape() {
	return { 
		verts: [], norms:[], pairs:[], faces:[] 
	};
}
      
function addShape( dest, source, offset, scale ) {
	var n;
	var o = { v:dest.verts.length, n:dest.norms.length, p:dest.pairs.length, f:dest.faces.length };
	
	var v = source.verts;
	for( n = 0; n < v.length; n++ ) {
		let vn;
		if( scale )
			vn = source.scaledVert( n, scale );
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
		dest.faces.push( [v[n][0] + o.p, v[n][1]+o.p, v[n][2]+o.p] );
	}


}

function moveShape( dest, offset ) {
	var n;
	var o = { v:dest.verts.length, n:dest.norms.length, p:dest.pairs.length, f:dest.faces.length };
	
	var v = source.verts;
	for( n = 0; n < v.length; n++ ) {
		dest.verts.push( { x: offset.x+v[n].x, y: offset.y+v[n].y, z: offset.z+v[n].z} );
	}
	var v = source.norms;
	for( n = 0; n < v.length; n++ ) {
		dest.norms.push( v[n] );
	}
	for( n = 0; n < v.length; n++ ) {
		dest.norms.push( v[n] );
	}


}

  
function composeExpressor() {
	var shape = Shape();
	addShape( shape, corner.outer0, {x:0,y:0,z:0} );
	addShape( shape, slot.vert_tab, {x:-consts.vtab_width,y:0,z:consts.swell_pad} );
	addShape( shape, hbar_swell.upper, {x:consts.swell_pad,y:0,z:0}, 2 );
	addShape( shape, hbar_swell.lower, {x:consts.swell_pad,y:0,z:consts.swell_pad+consts.vtab_height}, 2 );
	addShape( shape, slot.outer1, {x:2+consts.swell_pad,y:0,z:consts.swell_pad+consts.vtab_height} );

	addShape( shape, slot.outer2, {x:consts.swell_pad,y:0,z:consts.swell_pad+consts.vtab_height} );

	addShape( shape, slot.vert_tab, {x:consts.swell_pad+2,y:0,z:consts.swell_pad} );
	addShape( shape, slot.outer3, {x:2+consts.swell_pad,y:0,z:consts.swell_pad+consts.vtab_height} );
	moveShape( shape, {x:consts.vtab_width, y:0, z:0 } );
	return shape;
}

function composeCBeam() {
	var shape = Shape();
	addShape( shape, corner.outer0, {x:0,y:0,z:0} );
		
}

function createMesh( shape ) {

	var color = new THREE.Color( 0xffaa00 ); //optional
	//var materialIndex = 0; //optional

	var geometry = new THREE.Geometry();
	var material = new THREE.MeshStandardMaterial( { color: 0xAAAAAA, roughness:0.17, metalness:0.24  } );

	var n;
	for( n = 0; n < shape.verts.length; n++ ) {
		geometry.vertices.push( 
			new THREE.Vector3().copy( shape.verts[n] )  
		);
	}

	//create a new face using vertices 0, 1, 2
	var pairs = shape.pairs;
	for( n = 0; n < shape.faces.length; n++ ) {
		var face = shape.faces[n];
		
		var face = new THREE.Face3( pairs[face[0]][0], pairs[face[1]][0], pairs[face[2]][0]
				, [new THREE.Vector3().copy( shape.norms[pairs[face[0]][1]] )
				, new THREE.Vector3().copy( shape.norms[pairs[face[1]][1]] )
				, new THREE.Vector3().copy( shape.norms[pairs[face[2]][1]] )
				 ], color );
		geometry.faces.push( face );
	}

	geometry.computeBoundingSphere();

	return new THREE.Mesh( geometry, material );

}


	
}