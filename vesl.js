
//var THREE;
//if( typeof  window !== "undefined" ){
//	THREE = window.THREE;
//	console.log( "Set window.THREE to ", window.THREE );
//}
require( "./three.js/personalFill.js" );

const shapes = require( "./shapes.js" );
const keyboard = require( "./keyboard.js" );

const setup = require( "./three.setup.js" );
window.windowLoaded = ()=>{ 
	console.log( "ONLOAD"+ document.getElementById( "controls1" ) ); 
	let scene = setup(window,document); 
	loadSomeShapes( scene );
};

function loadSomeShapes(scene) {

	//let mesh;
	//mesh = shapes.createMesh( shapes.createGeometry( shapes.expressor ) );
	//shapes.makeText( mesh, "IF", "rgba(255, 255, 255, 1)", mesh.geometry.shape.label );
	//scene.add( mesh );

	var keypad = keyboard.composeKeypad();
	keypad.mesh.position.set( -6, 0, 2 );
	scene.add( keypad.mesh );
	var keypad = keyboard.composeKeyboard();
	keypad.mesh.position.set( 0, 0, 2 );
	scene.add( keypad.mesh );


	var m;
	var p = new THREE.Vector3( -1, 0, -1 );
	
	scene.add( m = shapes.keywords["="].mesh );
	m.position.copy( p );
	scene.add( m = shapes.keywords["<"].mesh );
	p.x += shapes.expressorConst.size.width;
	m.position.copy( p );
	scene.add( m = shapes.keywords[">"].mesh );
	p.x += shapes.expressorConst.size.width;
	m.position.copy( p );
	scene.add( m = shapes.keywords["=="].mesh );
	p.x += shapes.expressorConst.size.width;
	m.position.copy( p );

	
	scene.add( m = shapes.keywords["+"].mesh );
	p.x = -1;
	p.z += shapes.expressorConst.size.height;
	m.position.copy( p );
	scene.add( m = shapes.keywords["-"].mesh );
	p.x += shapes.expressorConst.size.width;
	m.position.copy( p );
	scene.add( m = shapes.keywords["*"].mesh );
	p.x += shapes.expressorConst.size.width;
	m.position.copy( p );
	scene.add( m = shapes.keywords["/"].mesh );
	p.x += shapes.expressorConst.size.width;
	m.position.copy( p );

	scene.add( m = shapes.keywords["function"].mesh );
	p.x = -1;
	p.z += shapes.expressorConst.size.height;
	m.position.copy( p );
	scene.add( m = shapes.keywords["``"].mesh );
	p.x += shapes.expressorConst.size.width;
	m.position.copy( p );
	scene.add( m = shapes.keywords["()"].mesh );
	p.x += shapes.expressorConst.size.width;
	m.position.copy( p );
	scene.add( m = shapes.keywords["<<"].mesh );
	p.x += shapes.expressorConst.size.width;
	m.position.copy( p );

	scene.add( m = shapes.keywords["&="].mesh );
	p.x = -1;
	p.z += shapes.expressorConst.size.height;
	m.position.copy( p );
	scene.add( m = shapes.keywords["||"].mesh );
	p.x += shapes.expressorConst.size.width;
	m.position.copy( p );
	scene.add( m = shapes.keywords["&&"].mesh );
	p.x += shapes.expressorConst.size.width;
	m.position.copy( p );
	scene.add( m = shapes.keywords["."].mesh );
	p.x += shapes.expressorConst.size.width;
	m.position.copy( p );

	p.z += shapes.expressorConst.size.height * 2;

	//scene.add( shapes. );
	//p.x += shapes.expressorConst.size.width;
	//m.position.copy( p );
	
}

