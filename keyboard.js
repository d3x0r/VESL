

const consts = require( "./shapes/consts.js" );
const tween = require( "./shapes/tween.js" );
const hbar_swell = require( "./shapes/hbar_swell.js" );
const vbar_swell = require( "./shapes/vbar_swell.js" );
const corner = require( "./shapes/corners.js" );

const shapes = require( "./shapes.js" );

const keySyms = [ [ ['`','~'],['1','!'],['2','@'],['3','#'],['4','$'],['5','%'],['6','^'],['7','&'],['8','*'],['9','('],['0',')'],['-','_'],['=','+'] ]
	, [ ['q','Q'], ['w','W'], ['e','E'], ['r','R'], ['t','T'], ['y','Y'], ['u','U'], ['i','I'], ['o','O'], ['p','P'], ['[','{'], [']','}'], ['\\','|'] ]
	, [ ['a','A'], ['s','S'], ['d','D'], ['f','F'], ['g','G'], ['h','H'], ['j','J'], ['k','K'], ['l','L'], [';',':'], ['\'','"'] ]
	, [ ['z','Z'], ['x','X'], ['c','C'], ['v','V'], ['b','B'], ['n','N'], ['m','M'], [',','<'], ['.','>'], ['/','?'] ]
        ];
const keyOffsets = [ 0, 1.5, 1.8, 2, 3.5 ]

const numSyms = [ '7','8','9','e'
		,'4','5','6','.'
		,'1','2','3','-'
		,'0','x','b','o' ];

function composeKey( s1, s2 ) {
	var shape = shapes.Shape();
	shapes.addShape( shape, corner.outer0, { x: 0, y:0, z:0 } );
	shapes.addShape( shape, hbar_swell.upper, { x:consts.swell_pad, y:0, z:0 }, consts.key_unit * s1 );
	shapes.addShape( shape, vbar_swell.left, { x:0, y:0, z:consts.swell_pad }, consts.key_unit *s1, consts.key_unit *s2 );
	shapes.addShape( shape, vbar_swell.right, { x:consts.swell_pad+consts.key_unit *s1, y:0, z:consts.swell_pad }, consts.key_unit *s1, consts.key_unit *s2 );
	shapes.addShape( shape, corner.outer1, { x:consts.swell_pad+consts.key_unit *s1, y:0, z:0 } );
	shapes.addShape( shape, hbar_swell.lower, { x:consts.swell_pad, y:0, z:consts.swell_pad+consts.key_unit *s2 }, consts.key_unit *s1 );
	shapes.addShape( shape, corner.outer2, { x:0, y:0, z:consts.swell_pad+consts.key_unit *s2 } );
	shapes.addShape( shape, corner.outer3, { x:consts.swell_pad+consts.key_unit *s1, y:0, z:consts.swell_pad+consts.key_unit *s2 } );

	shapes.addShape( shape, tween.key_fill, { x:consts.swell_pad, y:0, z:consts.swell_pad }, consts.key_unit *s1, consts.key_unit *s2 );
	shapes.addShape( shape, tween.key_bottom, { x:consts.swell_pad, y:0, z:consts.swell_pad }, consts.key_unit *s1, consts.key_unit *s2 );

	shape.size.width = consts.key_unit + 2*consts.swell_pad;
	shape.size.height = consts.key_unit + 2*consts.swell_pad;
	shape.label.size.width = consts.key_unit *s1;
	shape.label.size.height= consts.key_unit *s2;
	
	shape.label.pos.set( consts.swell_pad,
		consts.peice_depth + consts.inset_depth/2,
		consts.swell_pad
	);

	var xx = { shape:shape, geometry : shapes.createGeometry( shape ), mesh: null } ;
	xx.mesh = shapes.createMesh( xx.geometry );
	
	return xx;
}

function composeKeyboard() {
	var key = composeKey(1,1);
        var spaceKey = composeKey(6.75,1);
        var shiftKey = composeKey(2,1);


	var label = key.shape.label;
	var size = key.shape.size;

	var pad_frame = composeKey( 16 * size.width / consts.key_unit, 5.6 * size.width / consts.key_unit );
	var kinst;
	pad_frame.mesh.position -= consts.peice_depth;
	var color = "rgba(255,255,255,1.0)";

	for( var r = 0; r < keySyms.length; r++ ) {
		for( var c = 0; c < keySyms[r].length; c++ ) {
			pad_frame.mesh.add( kinst = key.mesh.clone() );
			var m1 = shapes.makeText( kinst, keySyms[r][c][0], color, label );
			var m2 = shapes.makeText( kinst, keySyms[r][c][1], color, label );
			kinst.syms = [ { mesh:m1, sym:keySyms[r][c][0] },{ mesh: m2, sym:keySyms[r][c][1]}];
			m2.visible = false;

			kinst.position.set( ( keyOffsets[r] + ( 1.1 * c) + 0.1 ) * size.width, consts.peice_depth/2, ((1.1*r)+0.1) * size.height );
		}
	}
	label = spaceKey.shape.label;
	size = spaceKey.shape.size;
	pad_frame.mesh.add( kinst = spaceKey.mesh.clone() );
	shapes.makeText( kinst, "SPACE", color, spaceKey.shape.label );
	kinst.position.set( ( keyOffsets[r] ) * size.width, consts.peice_depth/2, ((1.1*r)+0.1) * size.height );

	label = shiftKey.shape.label;
	size = shiftKey.shape.size;
	pad_frame.mesh.add( kinst = shiftKey.mesh.clone() );
	shapes.makeText( kinst, "Shift", color, shiftKey.shape.label );
	kinst.position.set( 0.1 * size.width, consts.peice_depth/2, ((1.1*3)+0.1) * size.height );

	label = shiftKey.shape.label;
	size = shiftKey.shape.size;
	pad_frame.mesh.add( kinst = shiftKey.mesh.clone() );
	shapes.makeText( kinst, "Shift", color, shiftKey.shape.label );
	kinst.position.set( 14 * size.width, consts.peice_depth/2, ((1.1*3)+0.1) * size.height );

	return pad_frame;
}

function composeKeypad() {
	var key = composeKey(1,1);
	var label = key.shape.label;
	var size = key.shape.size;

	var pad_frame = composeKey( 4.5 * size.width / consts.key_unit, 4.5 * size.width / consts.key_unit );
	var kinst;
	pad_frame.mesh.position -= consts.peice_depth;
	var color = "rgba(255,255,255,1.0)";

	pad_frame.mesh.add( kinst = key.mesh.clone() );
	shapes.makeText( kinst, numSyms[0], color, label );
	kinst.position.set( 0.1 * size.width, consts.peice_depth/2, 0.1 * size.height );

	pad_frame.mesh.add( kinst = key.mesh.clone() );
	shapes.makeText( kinst, numSyms[1], color, label );
	kinst.position.set( 1.2 * size.width, consts.peice_depth/2, 0.1 * size.height );

	pad_frame.mesh.add( kinst = key.mesh.clone() );
	shapes.makeText( kinst, numSyms[2], color, label );
	kinst.position.set( 2.3 * size.width, consts.peice_depth/2, 0.1 * size.height );

	pad_frame.mesh.add( kinst = key.mesh.clone() );
	shapes.makeText( kinst, numSyms[3], color, label );
	kinst.position.set( 3.4 * size.width, consts.peice_depth/2, 0.1 * size.height );
	
	pad_frame.mesh.add( kinst = key.mesh.clone() );
	shapes.makeText( kinst, numSyms[4], color, label );
	kinst.position.set( 0.1 * size.width, consts.peice_depth/2, 1.2 * size.height );

	pad_frame.mesh.add( kinst = key.mesh.clone() );
	shapes.makeText( kinst, numSyms[5], color, label );
	kinst.position.set( 1.2 * size.width, consts.peice_depth/2, 1.2 * size.height );

	pad_frame.mesh.add( kinst = key.mesh.clone() );
	shapes.makeText( kinst, numSyms[6], color, label );
	kinst.position.set( 2.3 * size.width, consts.peice_depth/2, 1.2 * size.height );

	pad_frame.mesh.add( kinst = key.mesh.clone() );
	shapes.makeText( kinst, numSyms[7], color, label );
	kinst.position.set( 3.4 * size.width, consts.peice_depth/2, 1.2 * size.height );
	
	pad_frame.mesh.add( kinst = key.mesh.clone() );
	shapes.makeText( kinst, numSyms[8], color, label );
	kinst.position.set( 0.1 * size.width, consts.peice_depth/2, 2.3 * size.height );

	pad_frame.mesh.add( kinst = key.mesh.clone() );
	shapes.makeText( kinst, numSyms[9], color, label );
	kinst.position.set( 1.2 * size.width, consts.peice_depth/2, 2.3 * size.height );

	pad_frame.mesh.add( kinst = key.mesh.clone() );
	shapes.makeText( kinst, numSyms[10], color, label );
	kinst.position.set( 2.3 * size.width, consts.peice_depth/2, 2.3 * size.height );

	pad_frame.mesh.add( kinst = key.mesh.clone() );
	shapes.makeText( kinst, numSyms[11], color, label );
	kinst.position.set( 3.4 * size.width, consts.peice_depth/2, 2.3 * size.height );
	
	pad_frame.mesh.add( kinst = key.mesh.clone() );
	shapes.makeText( kinst, numSyms[12], color, label );
	kinst.position.set( 0.1 * size.width, consts.peice_depth/2, 3.4 * size.height );

	pad_frame.mesh.add( kinst = key.mesh.clone() );
	shapes.makeText( kinst, numSyms[13], color, label );
	kinst.position.set( 1.2 * size.width, consts.peice_depth/2, 3.4 * size.height );

	pad_frame.mesh.add( kinst = key.mesh.clone() );
	shapes.makeText( kinst, numSyms[14], color, label );
	kinst.position.set( 2.3 * size.width, consts.peice_depth/2, 3.4 * size.height );

	pad_frame.mesh.add( kinst = key.mesh.clone() );
	shapes.makeText( kinst, numSyms[15], color, label );
	kinst.position.set( 3.4 * size.width, consts.peice_depth/2, 3.4 * size.height );
	
	return pad_frame;
}


module.exports = exports = {
	composeKeypad : composeKeypad,
	composeKeyboard : composeKeyboard
}

