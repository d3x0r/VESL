
//var THREE;
//if( typeof  window !== "undefined" ){
//	THREE = window.THREE;
//	console.log( "Set window.THREE to ", window.THREE );
//}
require( "./three.js/personalFill.js" );

const shapes = require( "./shapes.js" );

const setup = require( "./three.setup.js" );
window.windowLoaded = ()=>{ 
	console.log( "ONLOAD"+ document.getElementById( "controls1" ) ); 
	let scene = setup(window,document); 
	loadSomeShapes( scene );
};

function loadSomeShapes(scene) {
	let mesh;
	mesh = shapes.createMesh( shapes.expressor );
	scene.add( mesh );
	
}

