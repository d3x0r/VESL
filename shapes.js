
//const _THREE = window.THREE;
const consts = require( "./shapes/consts.js" );
const tween = require( "./shapes/tween.js" );
const inset = require( "./shapes/inset.js" );
const hbar_swell = require( "./shapes/hbar_swell.js" );
const vbar_swell = require( "./shapes/vbar_swell.js" );
const corner = require( "./shapes/corners.js" );
const slot = require( "./shapes/slot.js" );

const shapes = {
	parts : {
		c_ul:corner.outer0,
		c_ur:corner.outer1,
		c_ll:corner.outer2,
		c_lr:corner.outer3,
		i_ul:corner.inner0,
		i_ll:corner.inner1,
	},
	expressor : null,
	
	createGeometry : createGeometry,
	createMesh : createMesh,
	makeText : makeText,
	keywords : {
		
	}
}

function Shape(name) {
	return {
		verts: [], norms:[], pairs:[], faces:[],
		label: {x:0,y:0, z:0}
	};
}
      
function isNaN(x) {
  // Coerce into number
  x = Number(x);
  // if x is NaN, NaN != NaN is true, otherwise it's false
  return x != x;
}
function addShape( dest, source, offset, scale ) {
	var n;
	var o = { v:dest.verts.length, n:dest.norms.length, p:dest.pairs.length, f:dest.faces.length };
	
	var v = source.verts;
	console.log( "--------------- " + v.length);
	for( n = 0; n < v.length; n++ ) {
		let vn;
		if( scale )
			vn = source.scaledVert( n, scale );
		else
			vn = v[n];
		if( isNaN( vn.z ) )
			console.log( "Fatal:"+ n + "   " + JSON.stringify(v[n]) + "  " +JSON.stringify(vn) );
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
	var shape = Shape();
		shape.size = { width : consts.vtab_width + 2*consts.swell_pad + consts.top_hbar_height, height : consts.top_hbar_height + 2*consts.swell_pad };
		shape.label = {
			size : { width : consts.top_hbar_height - (consts.inset * 2 + consts.inset ), height: consts.top_hbar_height 
					- (consts.inset * 2 + consts.inset_pad ) 
			},
			pos: new THREE.Vector3( consts.swell_pad + consts.vtab_width + consts.inset + consts.inset_pad/2,
				consts.peice_depth - consts.inset_depth/2 ,
				consts.swell_pad + consts.inset+ consts.inset_pad/2
			) 
		};
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

	//addShape( shape, tween.top_hbar, {x:consts.swell_pad,y:0,z:consts.swell_pad}, 2 );
	addShape( shape, tween.bot_hbar, {x:consts.swell_pad,y:0,z:consts.swell_pad}, shape.label.size.width + consts.inset*2 + consts.inset_pad );



	addShape( shape, corner.outer3, {x:shape.label.size.width+ consts.vtab_width  + consts.inset*2 + consts.swell_pad + consts.inset_pad,y:0,z:consts.swell_pad+consts.vtab_height} );
	moveShape( shape, {x:consts.vtab_width, y:0, z:0 } );
	return shape;
}

function composeCBeam() {
	var shape = Shape();
	addShape( shape, corner.outer0, {x:0,y:0,z:0} );
		
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
	w = canvas1.width = metrics.width + 20;
	context1.font = "Bold 30px Arial";

	//context1.fillStyle = "rgba(0,0,255,0.3)";
	//context1.fillRect( 0, 0, w, h ); 

	context1.fillStyle = color;//"black";
	context1.fillText(t, canvas1.width/2-metrics.width/2, 30);

	window.document.body.appendChild( canvas1 );
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
	
module.exports = exports = shapes;
