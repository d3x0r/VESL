"use strict";

module.exports = exports = function() {

var controlNatural;
var controlOrbit;
var controlGame;
var controls;

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

		//geometryShader = new THREE.MeshBasicMaterial();

		 // for phong hello world test....
 		var light = new THREE.PointLight( 0xffFFFF, 1, 1000 );
 		light.position.set( 0, -500, 100 );
 		scene.add( light );

 		var light = new THREE.PointLight( 0xffFFFF, 1, 1000 );
 		light.position.set( 0, 500, 100 );
 		scene.add( light );

 		var light = new THREE.PointLight( 0xffFFFF, 1, 1000 );
 		light.position.set( 0, -500, -100 );
 		scene.add( light );

 		var light = new THREE.PointLight( 0xffFFFF, 1, 1000 );
 		light.position.set( -500, 500, 1 );
 		scene.add( light );
		/* INIT GOES HERE? */

		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );

		if ( !renderer.extensions.get('WEBGL_depth_texture') ) {
		          supportsExtension = false;
			console.log( "depth texture not available" );
		          document.querySelector('#error').style.display = 'block';
		          return;
		        }

		
		document.body.appendChild( renderer.domElement );

		controlNatural = new THREE.NaturalControls( camera, renderer.domElement );
		controlNatural.disable();

		controlOrbit = new THREE.OrbitControls( camera, renderer.domElement );
		controlOrbit.enable();

		controlGame = new THREE.GameMouse( camera, renderer.domElement );
		controlGame.enable();

		controls = controlOrbit;

	}

function slowanim() {
	setTimeout( animate, 256 );
}


var nFrame = 0;
var nTarget = 60;
var nTarget2 = 120;

function animate() {
	var delta = clock.getDelta();

		controls.update(delta);

		//console.log( "tick")
		//if( frame++ > 10 ) return
		if( slow_animate )
			requestAnimationFrame( slowanim );
		else
			requestAnimationFrame( animate );
		//var unit = Math.PI/2; //worst case visible

	renderer.clear();
	//console.log( "camera matrix:", JSON.stringify( camera.matrix ) );
	renderer.render( scene, camera );

}


init();
animate();

return scene;
}
