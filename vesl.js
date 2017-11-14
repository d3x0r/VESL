
const _3js = require( "three" );
if( typeof  window !== "undefined" ) {
	window.THREE = _3js;
	console.log( "Set window.THREE to ", window.THREE, "or", _3js );
}

const shapes = require( "./shapes.js" );

const setup = require( "./three.setup.js" );
window.windowLoaded = ()=>{ console.log( "ONLOAD"+ document.getElementById( "controls1" ) ); setup(window,document,_3js); };

