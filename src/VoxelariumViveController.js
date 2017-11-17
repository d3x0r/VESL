/**
* ripped and heavily modified to fit voxelarium functions (original paintvivecontroller)
 */

VESL.ViveController = function ( id ) {

	THREE.ViveController.call( this, id );

	var PI2 = Math.PI * 2;

	var MODES = { COLOR: 0, SIZE: 1 };
	var mode = MODES.COLOR;

	var color = new THREE.Color( 1, 1, 1 );
	var size = 1.0;

	//


	function generateHueTexture() {

		var canvas = document.createElement( 'canvas' );
		canvas.width = 256;
		canvas.height = 256;

		var context = canvas.getContext( '2d' );
		var imageData = context.getImageData( 0, 0, 256, 256 );
		var data = imageData.data;

		for ( var i = 0, j = 0; i < data.length; i += 4, j ++ ) {

			var x = ( ( j % 256 ) / 256 ) - 0.5;
			var y = ( Math.floor( j / 256 ) / 256 ) - 0.5;

			color.setHSL( Math.atan2( y, x ) / PI2, 1,( 0.5 - Math.sqrt( x * x + y * y ) ) * 2.0 );

			data[ i + 0 ] = color.r * 256;
			data[ i + 1 ] = color.g * 256;
			data[ i + 2 ] = color.b * 256;
			data[ i + 3 ] = 256;

		}

		context.putImageData( imageData, 0, 0 );

		return new THREE.CanvasTexture( canvas );

	}

	var geometry = new THREE.CircleGeometry( 1, 32 );
	var material = new THREE.MeshBasicMaterial( { map: generateHueTexture() } );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.position.set( 0, 0.005, 0.0495 );
	mesh.rotation.x = - 1.45;
	mesh.scale.setScalar( 0.02 );
	this.add( mesh )

	var geometry = new THREE.IcosahedronGeometry( 0.1, 2 );
	var material = new THREE.MeshBasicMaterial();
	material.color = color;
	var ball = new THREE.Mesh( geometry, material );
	mesh.add( ball );

	var laserPointer = {
		material : new THREE.LineBasicMaterial({ color:new THREE.Color( 0, 0.8, 0.8 )
				//,vertexColors: THREE.VertexColors
				,linewidth:5 /* windows == 1 always */
				}),
		geometry : new THREE.Geometry(),
		mesh : null
	}
	laserPointer.mesh = new THREE.LineSegments( laserPointer.geometry, laserPointer.material );

		{
		    var unit = 16.0;
		    var x = 0
		    var y = 0
		    var z = 0
		    var geometry = laserPointer.geometry;
		    geometry.vertices.length = 0;

		    var P = [THREE.Vector3Forward.clone().multiplyScalar( unit )
		        , THREE.Vector3Zero
		        ]
		    geometry.vertices.push( P[0] );
		    geometry.vertices.push( P[1] );

		    //color.delete();
		    geometry.computeBoundingSphere();
		    geometry.verticesNeedUpdate = true;
		    geometry.colorsNeedUpdate = true;

		}

		this.add( laserPointer.mesh );



	function onAxisChanged( event ) {

		//if ( this.getButtonState( 'thumbpad' ) === false ) return;

		var x = event.axes[ 0 ] / 2.0;
		var y = - event.axes[ 1 ] / 2.0;

		if ( mode === MODES.COLOR ) {
			color.setHSL( Math.atan2( y, x ) / PI2, 1, ( 0.5 - Math.sqrt( x * x + y * y ) ) * 2.0 );
			ball.position.x = event.axes[ 0 ];
			ball.position.y = event.axes[ 1 ];
		}

		if ( mode === MODES.SIZE ) {
			size = y + 1;
		}

	}

	function onGripsDown( event ) {

		if ( mode === MODES.COLOR ) {
			mode = MODES.SIZE;
			mesh.visible = false;
			return;
		}

		if ( mode === MODES.SIZE ) {
			mode = MODES.COLOR;
			mesh.visible = true;
			return;
		}

	}

	this.getColor = function () { return color; };
	this.getSize = function () { return size; };

	this.addEventListener( 'axischanged', onAxisChanged );
	this.addEventListener( 'gripsdown', onGripsDown );

}

VESL.ViveController.prototype = Object.create( THREE.ViveController.prototype );
VESL.ViveController.prototype.constructor = VESL.ViveController;
