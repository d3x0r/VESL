
const cannon = require( "cannon" );
const shapes = require( "./shapes.js" );
const input = require( "./keyboard.js" );
const consts = require( "./shapes/consts.js" );

module.exports = exports = { 
	update: null,
}

function init() {

    var world = new cannon.World(
    { 
        timestep: 1/60,
        iterations: 8,
        broadphase: 2,
        worldscale: 1,
        random: true,
        info:false,
        gravity: [0,-9.8,0]
    };


	function update ( delta ) {

		world.step( delta );

	}

	exports.update = update;	

	
	var keyboard = input.composeKeyboard();
	
	var n;
	var boardCollider = new cannon.Body();
	//var boardShape = new canmon.Box( new cannon.Vec3( 1, 1, 1 ) );
	//{relativePosition: new oimo.Vec3(), relativeRotation:new oimo.Mat33() }, 0,0,0 );

	for( n = 0; n < keyboard.mesh.children.length; n++ ) {
		var key = keyboard.mesh.children[n].geometry.shape;
		var keyMesh = keyboard.mesh.children[n];
		var keyCollider = new cannon.Body();
		var keyShape = new cannon.Box( {relativePosition: keyMesh.position, relativeRotation:keyMesh.matrix}, key.size.width, key.size.depth, key.size.height  );
		keyCollider.addShape( keyShape );
		boardCollider.addBody( keyShape );
		keyCollider.connectMesh( keyboard.mesh.children[n] );
		world.add( { type: "jointSlide"
			,  body1 : boardCollider
			, localAxis1 : new oimo.Vec3( 0, 1, 0 )
			, localAnchorPoint1 : new oimo.Vec3( keyMesh.position.x, keyMesh.position.y, keyMesh.position.z )
			, body2 : keyCollider
			, localAxis2 : new oimo.Vec3(0,1,0)
			, localAnchorPoint2 : new oimo.Vec3( 0, 0, 0 )
			, allowCollision : false
			, min : -1
			, max : 1
			}                       
		 ); 
		
	}
	world.add( boardCollider );
}

init();