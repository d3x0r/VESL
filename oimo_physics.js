
//const oimo = require( "oimo" );
const oimo = require( "./node_modules/oimo/build/oimo.js" );

const shapes = require( "./shapes.js" );
const input = require( "./keyboard.js" );
const consts = require( "./shapes/consts.js" );

module.exports = exports = { 
	update: null,
}

function init() {

    var world = new oimo.World({ 
        timestep: 1/60,
        iterations: 8,
        broadphase: 2,
        worldscale: 1,
        random: true,
        info:false,
        gravity: [0,-9.8,0]
    });


	var stepper = 0;
	var keys = [];
	function update ( delta ) {

		world.step( delta / 1 );
		

		if( stepper < 18 ) {
			//keyboard.mesh.position.y -= 0.2;
			boardCollider.setPosition( {x:0,y:stepper /100,z:0} );
		} else if( stepper < 36 ){
			//keyboard.mesh.position.y += 0.2;
			//keyboard.mesh.position.y += 0.1;
			//keys[3].applyImpulse( {x:0,y:-1,z:0}, 0.001 );
			//boardCollider.applyImpulse( {x:0,y:1,z:0}, 0.1 );
			boardCollider.setPosition( {x:0,y:stepper /100,z:0} );
		}else    {
			//boardCollider.applyImpulse( {x:0,y:-10,z:0}, 0.1 );
			//keyboard.mesh.position.y = 0;
			boardCollider.setPosition( {x:0,y:0,z:0} );
			stepper = 0;
		}
		//keys.forEach( key=>key.
		stepper++;

	}

function tickle() {
	if( keys[stepper] )
			//keys[stepper].applyImpulse( {x:consts.top_hbar_height,y:0,z:consts.top_hbar_height}, {x:0, y:0.01, z:0} );
			keys[stepper].applyImpulse( {x:(consts.top_hbar_height+consts.swell_pad)/2,y:0,z:(consts.top_hbar_height+consts.swell_pad)/2}, {x:0.0, y:0.18, z:0} );

	setTimeout( tickle, 930 );
}
tickle();

	exports.update = update;	

	
	var keyboard = input.composeKeyboard();
	
	var n;
	var boardCollider = world.add( { type:'box', size:[0.001, 0.001, 0.001], pos:[0,0,0], move:false, world:world} );;
	boardCollider.connectMesh( keyboard.mesh );
	//var boardShape = new oimo.Box( {relativePosition: new oimo.Vec3(), relativeRotation:new oimo.Mat33() }, 0,0,0 );

	for( n = 0; n < keyboard.mesh.children.length; n++ ) {
		var key = keyboard.mesh.children[n].geometry.shape;
		var keyMesh = keyboard.mesh.children[n];
		//var keyCollider = new oimo.RigidBody( keyMesh.position );
		var keyCollider = world.add( { type:'box', size:[key.size.width, consts.peice_depth, key.size.height], pos:[keyMesh.position.x,keyMesh.position.y,keyMesh.position.z], move:true, world:world} );
		keyCollider.allowSleep = false;
                keys.push( keyCollider );
		//keyCollider.pos.set( keyMesh.position );//setPosition( keyMesh.position );
		//console.log( "relative?", keyMesh.position );
		//var keyShape = new oimo.Box( {relativePosition: keyMesh.position, relativeRotation:keyMesh.matrix}, key.size.width, key.size.depth, key.size.height  );
		//keyCollider.addShape( keyShape );
		keyCollider.connectMesh( keyMesh );
		//world.add( keyCollider );		
	
		world.add( { type: "jointSlide"
		   , name: "KeySlider" + n
			,  body1 : boardCollider
			, axe1 : [ 0, 1, 0 ]
			, pos1 : [ keyMesh.position.x, keyMesh.position.y*1.2, keyMesh.position.z ]
			, body2 : keyCollider
			, axe2 : [0,1,0]
			, pos2 : [ 0, 0, 0 ]
			, allowCollision : false
			, min : -consts.peice_depth*10
			, max : consts.peice_depth
			, motor : [ 1, 4 ]
			, spring : [2.1, 0.2]
			}                       
		 ); 
		
	}
	//world.add( boardCollider );
}

init();