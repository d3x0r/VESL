
// three.js side of the shapes: geometry, meshes, text labels and whole
// blocks. The vertex recipes live in shapes/compose.js; block layout in
// layout/ (both run without three.js so they can be tested under node).

const consts = require( "./shapes/consts.js" );
const compose = require( "./shapes/compose.js" );
const blockdef = require( "./layout/blockdef.js" );
const layout = require( "./layout/layout.js" );
const tiler = require( "./layout/tiler.js" );

const Shape = compose.Shape;
const addShape = compose.addShape;

const shapes = {
	expressor : null,
	cBeam : null,
	Shape : Shape,
	addShape : addShape,
	createGeometry : createGeometry,
	createMesh : createMesh,
	makeText : makeText,
	expressorParts : null,
	statementParts : null,
	CBeam : null,
	// block descriptions
	defs : blockdef.defs,
	instance : blockdef.instance,
	layoutBlock : layout.layoutBlock,
	bounds : layout.bounds,
	callFor : require( "./layout/signature.js" ).callFor,
	tileBlock : tiler.tileBlock,
	buildBlock : buildBlock,
	makeBlockObject : makeBlockObject,
	// canned examples (also what vesl.js shows)
	makeCallBlock : makeCallBlock,
	makeSwitchBlock : makeSwitchBlock,
	makeObjectBlock : makeObjectBlock,
	makeClassBlock : makeClassBlock,
	makeFunctionBlock : makeFunctionBlock,
	keywords : {
		
	}
}

// ---- blocks from descriptions --------------------------------------------

// instance -> { layout, shape }: lays the block out and tiles it. Children
// (plugged-in values, hanging statements) are laid out too but tiled
// separately by makeBlockObject, since each is its own draggable thing.
function buildBlock( inst ) {
	const node = layout.layoutBlock( inst );
	return { layout: node, shape: tiler.tileBlock( node ) };
}

// instance -> THREE.Object3D containing this block's mesh and labels, with
// every child block attached at the position its connector dictates.
function makeBlockObject( inst, opts ) {
	opts = opts || {};
	const built = buildBlock( inst );
	return objectFromLayout( built.layout, opts );
}

function objectFromLayout( node, opts ) {
	const shape = node.shape || tiler.tileBlock( node );
	const o = new THREE.Object3D();
	o.userData.block = node;
	const mesh = createMesh( createGeometry( shape ), opts.material );
	o.add( mesh );
	if( shape.ghost && shape.ghost.faces.length ) {
		if( !shapes.ghostMaterial )
			shapes.ghostMaterial = new THREE.MeshStandardMaterial( { color: 0xAAAAAA, roughness:0.17, metalness:0.24, transparent:true, opacity:0.3, depthWrite:false } );
		const ghost = createMesh( createGeometry( shape.ghost ), opts.ghostMaterial || shapes.ghostMaterial );
		ghost.userData.ghost = true;
		o.add( ghost );
	}
	const color = opts.labelColor || "rgba(0,0,0,1.0)";
	const ghostColor = opts.ghostLabelColor || "rgba(0,0,0,0.35)";
	for( const l of shape.labels )
		makeText( o, l.text, l.ghost ? ghostColor : color, l );
	for( const c of node.children ) {
		const child = objectFromLayout( c.node, opts );
		// layout y runs down the piece: that is z here; lifted values sit a layer up
		child.position.set( c.x, ( c.lift || 0 ) * layout.metrics.liftHeight, c.y );
		o.add( child );
	}
	return o;
}

// ---- example blocks --------------------------------------------------------

function exampleCall( name ) {
	return blockdef.instance( 'call', { fields:{ callee:name },
		sections:{ args:[ { fields:{ key:'a' }, inputs:{ value: blockdef.instance( 'value', { fields:{ text:'1' } } ) } } ] } } );
}

function makeCallBlock( ) {
	return buildBlock( exampleCall( 'f' ) ).shape;
}

function makeSwitchBlock( ) {
	const inst = blockdef.instance( 'switch', {
		inputs:{ discriminant: blockdef.instance( 'value', { fields:{ text:'x' } } ) },
		sections:{
			cases:[
				{ inputs:{ value: blockdef.instance( 'value', { fields:{ text:'1' } } ) }, statements:[ exampleCall( 'log' ), exampleCall( 'beep' ) ] },
				{ inputs:{ value: blockdef.instance( 'value', { fields:{ text:'2' } } ) }, statements:[
					blockdef.instance( 'if', { inputs:{ condition: blockdef.instance( 'value', { fields:{ text:'ok' } } ) },
						sections:{ then:[ { statements:[ exampleCall( 'go' ) ] } ] } } ) ] },
			],
			'default':[ { statements:[ exampleCall( 'other' ) ] } ],
		} } );
	return buildBlock( inst ).shape;
}

function makeObjectBlock( ) {
	const inst = blockdef.instance( 'object', { sections:{ fields:[
		{ fields:{ key:'a' } }, { fields:{ key:'b' } }, { fields:{ key:'c' } }, { fields:{ key:'d' } } ] } } );
	return buildBlock( inst ).shape;
}

function makeClassBlock( ) {
	const inst = blockdef.instance( 'class', { fields:{ name:'Point' }, sections:{
		fields:[
			{ fields:{ key:'x' }, inputs:{ value: blockdef.instance( 'value', { fields:{ text:'0' } } ) } },
			{ fields:{ key:'style' }, inputs:{ value: blockdef.instance( 'object', { sections:{ fields:[ { fields:{ key:'color' } }, { fields:{ key:'size' } } ] } } ) } },
		],
		constructor:[ { statements:[ blockdef.instance( 'assign', { fields:{ target:'this.x' } } ) ] } ],
		methods:[ { fields:{ key:'length' }, statements:[ blockdef.instance( 'return' ) ] } ],
		getters:[ { fields:{ key:'norm' }, statements:[ blockdef.instance( 'return' ) ] } ],
	} } );
	return buildBlock( inst ).shape;
}

function makeFunctionBlock( ) {
	const inst = blockdef.instance( 'function', { fields:{ name:'area' },
		sections:{ body:[ { statements:[ exampleCall( 'measure' ), blockdef.instance( 'return' ) ] } ] } } );
	return buildBlock( inst ).shape;
}


function makeText( parent, t, color, v )
{
	// A label is drawn onto a canvas with the same aspect as the plate it
	// sits on, so text is neither stretched nor cropped.
	let canvas1 = document.createElement('canvas');
	let context1 = canvas1.getContext('2d');

	let sw = v.size.width;
	let sh = v.size.height;
	let h = consts.text_pixels_square_per_hbar_height;
	let w = Math.max( h, Math.round( h * sw / sh ) );
	canvas1.width = w;
	canvas1.height = h;

	let px = Math.round( h * 0.75 );
	context1.font = "Bold " + px + "px Arial";
	let metrics = context1.measureText( t );
	if( metrics.width > w - 4 ) {
		px = Math.max( 6, Math.floor( px * ( w - 4 ) / metrics.width ) );
		context1.font = "Bold " + px + "px Arial";
		metrics = context1.measureText( t );
	}

	context1.fillStyle = color;
	context1.textBaseline = "middle";
	context1.fillText( t, w/2 - metrics.width/2, h/2 );

	// canvas contents will be used for a texture
	let texture1 = new THREE.Texture(canvas1)
	texture1.needsUpdate = true;
	texture1.minFilter = THREE.LinearFilter;
	texture1.colorSpace = THREE.SRGBColorSpace;

	// a decal over the top face: the polygon offset keeps it from
	// z-fighting with the surface it sits a hair above
	let material1 = new THREE.MeshBasicMaterial( {map: texture1
		, transparent:true
		, depthWrite:false
		, polygonOffset:true, polygonOffsetFactor:-2, polygonOffsetUnits:-2
		} );

	var mesh1 = new THREE.Mesh(
		new THREE.PlaneGeometry(sw, sh),
		material1
	);
	mesh1.position.set( v.pos.x + sw/2, v.pos.y, v.pos.z+sh/2 );
	mesh1.rotateX( -Math.PI/2 );
	if( parent )
		parent.add( mesh1 );
	return mesh1;
}

function recomputeText( t ) {

	let metrics = canvas.ctx.measureText( t.text );
	let w, h;
	w = t.canvas.width = metrics.width + 20;

	t.ctx.font = "Bold 30px Arial";
	

	t.texture.needsUpdate = true;
	
}

function addVarText( t, char ) {
	var sourceChar = char;

	if( char == '\b' ) {
		if( t.text.length > 0 ) 
			t.text = t.text.substr( 0, t.text.length-1 );
	} else if( char === ' ' ){
		if( isString )
			t.text += ' ';
		else
			t.shift_toggle = true;
	} else if( Array.isArray( char ) ) {
		if( t.shift_toggle )
			t.text += sourceChar[1];
		else
			t.text += sourceChar[0];
	} else
		t.text += char;
	recomputeText( t );
}

function makeVarText( parent, color, v, isString )
{
	let canvas = {
		canvas : document.createElement('canvas'),
		ctx : null,
		text : "",
		shift_toggle : false,
		isString : isString,
		color : color,
		texture : null,
		material : null,
		mesh : null,
		parentShape : null,
		label : v		
	}	
	canvas.ctx = canvas.canvas.getContext('2d' );

	let sw = v.size.width;
	let sh = v.size.height;//metrics.emHeightAscent - metrics.emHeightDescent

	let w = 40;//metrics.width 
	let h = 40;//metrics.emHeightAscent - metrics.emHeightDescent
	canvas.canvas.height = 40;//consts.top_hbar_height - ( consts.inset*2 +consts.inset_pad );
	canvas.canvas.width = w;//consts.top_hbar_height - ( consts.inset*2 +consts.inset_pad );
	let bl = ( ( canvas.canvas.height / 2 ) + h/2 ) + 0;//metrics.emHeightDescent;

	canvas.ctx.textBaseLine = bl;

	canvas.ctx.font = "Bold 30px Arial";
	let metrics = canvas.ctx.measureText( t );
	console.log( "width of text is:", metrics.width, t );
	w = canvas.canvas.width = metrics.width + 20;
	canvas.ctx.font = "Bold 30px Arial";

	//canvas.ctx.fillStyle = "rgba(0,0,255,0.3)";
	//canvas.ctx.fillRect( 0, 0, w, h ); 

	canvas.ctx.fillStyle = color;//"black";
	canvas.ctx.fillText(t, canvas.canvas.width/2-metrics.width/2, 30);

	//window.document.body.appendChild( canvas.canvas );

	// canvas contents will be used for a texture
	canvas.texture = new THREE.Texture(canvas.canvas)
	canvas.texture.needsUpdate = true;
	// default is currently THREE.MipMapNearestFilter
	canvas.texture.minFilter = THREE.NearestFilter;

	canvas.material = new THREE.MeshBasicMaterial( {map: canvas.texture
		//, side:THREE.DoubleSide
		, transparent:true
		} );

	//material1.transparent = true;
	//material1.depthWrite = false;

	canvas.mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(sw, sh),
		canvas.material
	);
	if( v )
		canvas.mesh.position.set( v.pos.x + sw/2, v.pos.y, v.pos.z+sh/2 );
	else
		canvas.mesh.position.set(0,1,0);
	canvas.mesh.rotateX( -Math.PI/2 );
	if( parent )
		parent.add( canvas.mesh );
	return canvas;
}

// Rebuild the vertex buffers of a geometry from its (edited) shape.
function updateGeometry( geometry ) {
	fillGeometry( geometry, geometry.shape );
	geometry.attributes.position.needsUpdate = true;
	geometry.attributes.normal.needsUpdate = true;
	geometry.computeBoundingSphere();
}

// A shape is a list of verts, a list of norms, pairs [vert, norm] and faces
// of three pairs. Modern three.js has no indexed vertex+normal pairs, so the
// faces are unrolled into flat position and normal buffers.
function fillGeometry( geometry, shape ) {
	const pairs = shape.pairs;
	const count = shape.faces.length * 3;
	const position = new Float32Array( count * 3 );
	const normal = new Float32Array( count * 3 );
	let o = 0;
	for( const face of shape.faces ) {
		for( let k = 0; k < 3; k++ ) {
			const pair = pairs[face[k]];
			const v = shape.verts[pair[0]], n = shape.norms[pair[1]];
			position[o] = v.x; position[o+1] = v.y; position[o+2] = v.z;
			normal[o] = n.x; normal[o+1] = n.y; normal[o+2] = n.z;
			o += 3;
		}
	}
	geometry.setAttribute( 'position', new THREE.BufferAttribute( position, 3 ) );
	geometry.setAttribute( 'normal', new THREE.BufferAttribute( normal, 3 ) );
}

function createGeometry( shape ) {
	const geometry = new THREE.BufferGeometry();
	fillGeometry( geometry, shape );
	geometry.computeBoundingSphere();
	geometry.shape = shape;
	return geometry;
}

function createMesh( geometry, material ) {
	if( !shapes.defaultMaterial )
		shapes.defaultMaterial = new THREE.MeshStandardMaterial( { color: 0xAAAAAA, roughness:0.17, metalness:0.24  } );
	var mesh = new THREE.Mesh( geometry, material || shapes.defaultMaterial );
	return mesh;
}

function init() {
	
	shapes.expressorConst = compose.composeExpressor(0);
	shapes.expressor = compose.composeExpressor(1);
	shapes.expressorParts = shapes.expressor.parts;
	shapes.expressorConstGeometry = createGeometry( shapes.expressorConst );
	shapes.expressorGeometry = createGeometry( shapes.expressor );
	shapes.expressorConstMesh = createMesh( shapes.expressorConstGeometry );
	shapes.expressorMesh = createMesh( shapes.expressorGeometry );
	
	shapes.CBeam = compose.composeCBeam();
	for( const key in shapes.CBeam ) {
		const part = shapes.CBeam[key];
		part.geometry = createGeometry( part.shape );
		part.mesh = createMesh( part.geometry );
	}
	shapes.statementParts = compose.composeStatements();
		
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
