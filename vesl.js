
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


	var o;

	var p = new THREE.Vector3( -12, 0, -4 );
	

	o = new THREE.Object3D();
	scene.add( o );
	o.position.copy( p );	
	o.add( shapes.CBeam.ulCornerCallable.mesh )
	p.x += 2;

	o = new THREE.Object3D();
	scene.add( o );
	o.position.copy( p );	
	o.add( shapes.CBeam.ulCornerCall.mesh  )
	p.x += 2;
		// outputs always have value not command....
	o = new THREE.Object3D();
	scene.add( o );
	o.position.copy( p );	
	o.add( shapes.CBeam.ulCornerOutput.mesh )
	p.x += 2;
	o = new THREE.Object3D();
	scene.add( o );
	o.position.copy( p );	
	o.add( shapes.CBeam.ulCornerBlock.mesh )
	p.x += 2;

	o = new THREE.Object3D();
	scene.add( o );
	o.position.copy( p );	
	o.add( shapes.CBeam.vBarFork.mesh  )
	p.x += 2;

	o = new THREE.Object3D();
	scene.add( o );
	o.position.copy( p );	
	o.add( shapes.CBeam.vBarTab.mesh  )
	p.x += 2;

	o = new THREE.Object3D();
	scene.add( o );
	o.position.copy( p );	
	o.add( shapes.CBeam.lowerBar.mesh  )
	p.x += 2;

	o = new THREE.Object3D();
	scene.add( o );
	o.position.copy( p );	
	o.add( shapes.CBeam.lowerBarCommand.mesh  )
	p.x += 2;

	o = new THREE.Object3D();
	scene.add( o );
	o.position.copy( p );	
	o.add( shapes.CBeam.hBarBottomExtension.mesh  )
	p.x += 2;

	o = new THREE.Object3D();
	scene.add( o );
	o.position.copy( p );	
	o.add( shapes.CBeam.lowerBarEnd.mesh  )
	p.x += 2;

	o = new THREE.Object3D();
	scene.add( o );
	o.position.copy( p );	
	o.add( shapes.CBeam.vBarExtension.mesh  )
	p.x += 2;

	var shape = shapes.makeCallBlock();
	p.x = -10;
	p.z += 1;
	o = new THREE.Object3D();
	scene.add( o );
	o.position.copy( p );	
	o.add( shapes.createMesh( shapes.createGeometry( shape ) )  );
	p.x += 4;

	var shape = shapes.makeSwitchBlock();
	o = new THREE.Object3D();
	scene.add( o );
	o.position.copy( p );	
	o.add( shapes.createMesh( shapes.createGeometry( shape ) )  );
	p.x = 2;

	var shape = shapes.makeObjectBlock();
	o = new THREE.Object3D();
	scene.add( o );
	o.position.copy( p );	
	o.add( shapes.createMesh( shapes.createGeometry( shape ) )  );
	p.x += 4;


	//let mesh;
	//mesh = shapes.createMesh( shapes.createGeometry( shapes.expressor ) );
	//shapes.makeText( mesh, "IF", "rgba(255, 255, 255, 1)", mesh.geometry.shape.label );
	//scene.add( mesh );
	var p = new THREE.Vector3( -1, 0, 2 );

	var mesh = shapes.createMesh( shapes.createGeometry( shapes.expressorParts.left ) );
	mesh.position.copy(p);
	p.x += 0.25;
	scene.add( mesh );
		var mesh = shapes.createMesh( shapes.createGeometry( shapes.expressorParts.leftTab ) )
	mesh.position.copy(p);
	p.x += 0.25;
	scene.add( mesh );
		var mesh = shapes.createMesh( shapes.createGeometry( shapes.expressorParts.right ) )
	mesh.position.copy(p);
	p.x += 0.25;
	scene.add( mesh );
		var mesh = shapes.createMesh( shapes.createGeometry( shapes.expressorParts.rightTab ) )
	mesh.position.copy(p);
	p.x += 0.25;
	scene.add( mesh );
		var mesh = shapes.createMesh( shapes.createGeometry( shapes.expressorParts.leftVar ) )
	mesh.position.copy(p);
	p.x += 0.25;
	scene.add( mesh );
		var mesh = shapes.createMesh( shapes.createGeometry( shapes.expressorParts.leftVarTab ) )
	mesh.position.copy(p);
	p.x += 0.25;
	scene.add( mesh );
		var mesh = shapes.createMesh( shapes.createGeometry( shapes.expressorParts.rightVar ) )
	mesh.position.copy(p);
	p.x += 0.25;
	scene.add( mesh );
		var mesh = shapes.createMesh( shapes.createGeometry( shapes.expressorParts.rightVarTab ) )
	mesh.position.copy(p);
	p.x += 0.25;
	scene.add( mesh );
		var mesh = shapes.createMesh( shapes.createGeometry( shapes.expressorParts.middleFill ) )
	mesh.position.copy(p);
	p.x += 0.25;
	scene.add( mesh );
		var mesh = shapes.createMesh( shapes.createGeometry( shapes.expressorParts.middleVarFill ) )
	mesh.position.copy(p);
	scene.add( mesh );

	p.z += 0.75;
		var mesh = shapes.createMesh( shapes.createGeometry( shapes.expressorParts.middleConstVar ) )
	mesh.position.copy(p);
	p.x += 0.25;
	scene.add( mesh );


	if(1) {
	var p = new THREE.Vector3( -6, 0, 3 );
	var n;
	//for( n = 0; n < 50; n++ ) {
	var keypad = keyboard.composeKeypad();
	
	keypad.mesh.position.copy( p );
	scene.add( keypad.mesh );
	var keypad = keyboard.composeKeyboard();

	keypad.mesh.position.copy ( p );
	keypad.mesh.position.x = 0;
	scene.add( keypad.mesh );
	p.z += 3;
	//}
	}

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

