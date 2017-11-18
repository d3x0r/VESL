"use strict";





module.exports = exports = function( VR ) {

if( VR ) {
  require( './three.js/AltSpace_WebVR_fill.js');

  //if( AltSpace )
  //  require( './three.js/js/controls/AltSpaceControls.js' );
  //else
    require( './three.js/js/controls/VRControls.js' );
//  require( './three.js/js/effects/VREffect.js' );
//  require( './three.js/js/effects/StereoEffect.js' );


  require( './three.js/js/vr/ViveController.js' );
  //require( './three.js/js/vr/PaintViveController.js' );
  require( './src/VoxelariumViveController.js' );
  require( './three.js/js/vr/WebVR.js' );
  require( './three.js/js/loaders/OBJLoader.js' );
}

if( !VR ) {
  require( "./controls/orbit_controls.js" )
  require( "./controls/NaturalCamera.js" )
  //require( "./controls/gameMouse.js" )

}

var controlNatural;
var controlOrbit;
var controlGame;
var controls;

var controller1;
var controller2;
//var effect; // the actual thing to render for VR?

	var scene;
	var scene2;
	var scene3;
	var camera, renderer;
	var light;
	var geometry, material, mesh = [];
	var frame_target = [];
	var slow_animate = false;
	var frame = 0;

	var tests = [];

var screen = { width:window.innerWidth, height:window.innerHeight };

	//const totalUnit = Math.PI/(2*60);
	//const unit = totalUnit;
	var delay_counter = 60*3;
	//const pause_counter = delay_counter + 120;
	var single_counter = 60;
	var totalUnit = Math.PI/2;
	var unit = totalUnit / single_counter;
	var pause_counter = 120;

	var counter= 0;

	var clock = new THREE.Clock()



function setControls1() {
	controls.disable();
	camera.matrixAutoUpdate = false;
	controls = controlNatural;
	controls.enable(camera);
}
function setControls2() {
	controls.disable();
	camera.matrixAutoUpdate = false;  // current mode doesn't auto update
	controls = controlOrbit;
	controls.enable(camera);
}

function setControls3() {
	controls.disable();
	camera.matrixAutoUpdate = false;  // current mode doesn't auto update
	controls = controlGame;
	controls.enable(camera);
}


var status_line;

	function init() {
		document.getElementById( "controls1").onclick = setControls1;
		document.getElementById( "controls2").onclick = setControls2;
		document.getElementById( "controls3").onclick = setControls3;

		scene = new THREE.Scene();
		scene2 = new THREE.Scene();
		scene3 = new THREE.Scene();

		camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.001, 10000 );

		camera.matrixAutoUpdate = false;
		camera.position.z = 5;
		camera.matrixWorldNeedsUpdate = true;

		 // for phong hello world test....
 		var light = new THREE.PointLight( 0xffFFFF, 1, 1000 );
 		light.position.set( 0, -100, 100 );
 		scene.add( light );

 		var light = new THREE.PointLight( 0xffFFFF, 1, 1000 );
 		light.position.set( 0, 100, 100 );
 		scene.add( light );

 		var light = new THREE.PointLight( 0xffFFFF, 1, 1000 );
 		light.position.set( 0, -100, -100 );
 		scene.add( light );

 		var light = new THREE.PointLight( 0xffFFFF, 1, 1000 );
 		light.position.set( -500, 500, 1 );
 		scene.add( light );
 		var light = new THREE.PointLight( 0xffFFFF, 1, 1000 );
 		light.position.set( 500, -500, 1 );
 		scene.add( light );
		/* INIT GOES HERE? */

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );

		//if ( !renderer.extensions.get('WEBGL_depth_texture') ) {
		//          supportsExtension = false;
//			console.log( "depth texture not available" );
//		          document.querySelector('#error').style.display = 'block';
//		          return;
//		        }


		document.body.appendChild( renderer.domElement );
		if ( typeof WEBVR !== "undefined" )
			document.body.appendChild( WEBVR.createButton( renderer ) )

		if( THREE.NaturalControls ) {
			controlNatural = new THREE.NaturalControls( camera, renderer.domElement );
			controlNatural.disable();
		}

		if( THREE.OrbitControls ) {
			controlOrbit = new THREE.OrbitControls( camera, renderer.domElement );
			controlOrbit.disable();
		}

		if( THREE.GameMouse ) {
			controlGame = new THREE.GameMouse( camera, renderer.domElement );
			controlGame.disable();
		}

		if( VR ) {

			function handleController( controller ) {
				// update controller object from VR input (gamepad)
				controller.update();

				var pivot = controller.getObjectByName( 'pivot' );

				if ( pivot ) {

					pivot.material.color.copy( controller.getColor() );

					var matrix = pivot.matrixWorld;

					var point1 = controller.userData.points[ 0 ];
					var point2 = controller.userData.points[ 1 ];

					var matrix1 = controller.userData.matrices[ 0 ];
					var matrix2 = controller.userData.matrices[ 1 ];

					point1.setFromMatrixPosition( matrix );
					matrix1.lookAt( point2, point1, THREE.Vector3Up );

					if ( controller.getButtonState( 'trigger' ) ) {

						// this is the old drawing code...
						//stroke( controller, point1, point2, matrix1, matrix2 );

					}

					point2.copy( point1 );
					matrix2.copy( matrix1 );

				}

			}


			function setupViveControls( scene ) {

					// update camera poosition from VR inputs...
				//if( Voxelarium.Settings.AltSpace ) {
				//	controls = new THREE.AltSpaceControls( camera );
				//} else
				//effect = new THREE.VREffect( renderer );
				//effect = new THREE.StereoEffect( renderer );
				//effect.autoSubmitFrame = false;
				//effect.autoClear = true;
				//effect.setSize( window.innerWidth*4/5, window.innerHeight*4/5 );

				//controls = new THREE.VRControls( camera );
				//controls.standing = true;

				scene.add( new THREE.HemisphereLight( 0x888877, 0x777788 ) );

				var headLight = new THREE.DirectionalLight( 0xffffff );
				headLight.position.set( 0, 6, 0 );
				headLight.castShadow = true;
				headLight.shadow.camera.top = 2;
				headLight.shadow.camera.bottom = -2;
				headLight.shadow.camera.right = 2;
				headLight.shadow.camera.left = -2;
				headLight.shadow.mapSize.set( 4096, 4096 );
				scene.add( headLight );

				// controllers
				var controller1 = new VESL.ViveController( 0 );
				controller1.standingMatrix = controls.getStandingMatrix();
				controller1.userData.points = [ new THREE.Vector3(), new THREE.Vector3() ];
				controller1.userData.matrices = [ new THREE.Matrix4(), new THREE.Matrix4() ];
				controller1.userData.altspace = { collider: { enabled: false } };
				scene.add( controller1 );

				var controller2 = new VESL.ViveController( 1 );
				controller2.standingMatrix = controls.getStandingMatrix();
				controller2.userData.points = [ new THREE.Vector3(), new THREE.Vector3() ];
				controller2.userData.matrices = [ new THREE.Matrix4(), new THREE.Matrix4() ];
				controller2.userData.altspace = { collider: { enabled: false } };
				scene.add( controller2 );

				var loader = new THREE.OBJLoader();
				loader.setPath( 'models/obj/vive-controller/' );
				loader.load( 'vr_controller_vive_1_5.obj', function ( object ) {
					var loader = new THREE.TextureLoader();
					loader.setPath( 'models/obj/vive-controller/' );

					var controller = object.children[ 0 ];
					controller.material.map = loader.load( 'onepointfive_texture.png' );
					controller.material.specularMap = loader.load( 'onepointfive_spec.png' );
					controller.castShadow = true;
					controller.receiveShadow = true;

					// var pivot = new THREE.Group();
					// var pivot = new THREE.Mesh( new THREE.BoxGeometry( 0.01, 0.01, 0.01 ) );
					var pivot = new THREE.Mesh( new THREE.IcosahedronGeometry( 0.002, 2 ) );
					pivot.name = 'pivot';
					pivot.position.y = -0.016;
					pivot.position.z = -0.043;
					pivot.rotation.x = Math.PI / 5.5;
					controller.add( pivot );

					controller1.add( controller.clone() );

					pivot.material = pivot.material.clone();
					controller2.add( controller.clone() );
				} );
			}
			setupViveControls( scene );

		}
		else {
			controls = controlNatural;
			if( controls )
				controls.enable();
		}

	}

function slowanim() {
	setTimeout( animate, 256 );
}


var nFrame = 0;
var nTarget = 60;
var nTarget2 = 120;

function beginAnimate()  {
	renderer.animate( render );
}

function render() {
	var delta = clock.getDelta();
	if( controls )
		controls.update(delta);

	if( controller1 ) {
		handleController( controller1 );
		handleController( controller2 );
	}
		//console.log( "tick")
		//if( frame++ > 10 ) return
		//if( slow_animate )
	//		requestAnimationFrame( slowanim );
	//	else
	//		requestAnimationFrame( animate );
		//var unit = Math.PI/2; //worst case visible
		//renderer.clear();
		//console.log( "camera matrix:", JSON.stringify( camera.matrix ) );
	renderer.render( scene, camera );

}


init();
beginAnimate();

return scene;
}
