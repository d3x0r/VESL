
const _3js = require( "three" );
require( "./three.js/personalFill.js" );
if( typeof  window !== "undefined" ) {
	window.THREE = _3js;
	console.log( "Set window.THREE to ", window.THREE, "or", _3js );
}

const shapes = require( "./shapes.js" );

const setup = require( "./three.setup.js" );
window.windowLoaded = ()=>{ 
	console.log( "ONLOAD"+ document.getElementById( "controls1" ) ); 
	let scene = setup(window,document,_3js); 
	loadSomeShapes( scene );
};

function loadSomeShapes(scene) {
	let mesh;
	mesh = shapes.createMesh( shapes.expressor );
	scene.add( mesh );
	
}

