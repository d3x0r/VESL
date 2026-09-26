// Sample block instances shared by vesl.js (3D scene), preview.html and
// layout/examples.js (SVG output).

const { instance } = require( "./blockdef.js" );

const value = ( t )=> instance( 'value', { fields:{ text:t } } );
const call = ( f, args, kind )=> instance( kind || 'call', { fields:{ callee:f },
	sections:{ args: ( args || [] ).map( k=>( { fields:{ key:k }, inputs:{ value: value( '1' ) } } ) ) } } );
const apply = ( f, args )=> call( f, args, 'apply' );

function samples() {
	return {
		'call': call( 'f', [ 'a' ] ),
		'switch': instance( 'switch', {
			inputs:{ discriminant: value( 'x' ) },
			sections:{
				cases:[
					{ inputs:{ value: value( '1' ) }, statements:[ call( 'log', [ 'msg' ] ), call( 'beep' ) ] },
					{ inputs:{ value: value( '2' ) }, statements:[] },
					{ inputs:{ value: value( '3' ) }, statements:[ instance( 'if', { inputs:{ condition: value( 'ok' ) }, sections:{ then:[ { statements:[ call( 'go' ) ] } ] } } ) ] },
				],
				'default':[ { statements:[ call( 'other' ) ] } ],
			} } ),
		'class': instance( 'class', { fields:{ name:'Point' }, sections:{
			fields:[
				{ fields:{ key:'x' }, inputs:{ value: value( '0' ) } },
				{ fields:{ key:'style' }, inputs:{ value: instance( 'object', { sections:{ fields:[ { fields:{ key:'color' }, inputs:{ value: value( 'red' ) } }, { fields:{ key:'size' } } ] } } ) } },
			],
			constructor:[ { inputs:{ params: value( 'x, y' ) }, statements:[ instance( 'assign', { fields:{ target:'this.x' }, inputs:{ value: value( 'x' ) } } ) ] } ],
			methods:[ { fields:{ key:'length' }, statements:[ instance( 'return', { inputs:{ value: apply( 'hypot', [ 'a', 'b' ] ) } } ) ] } ],
			getters:[ { fields:{ key:'norm' }, statements:[ instance( 'return' ) ] } ],
			setters:[ { fields:{ key:'norm' }, inputs:{ params: value( 'v' ) }, statements:[] } ],
			operators:[ { fields:{ op:'+' }, inputs:{ params: value( 'other' ) }, statements:[ instance( 'return' ) ] } ],
		} } ),
		'interface': instance( 'interface', { fields:{ name:'Shape' }, sections:{
			properties:[ { fields:{ key:'area' }, inputs:{ type: value( 'number' ) } } ],
			methods:[ { fields:{ key:'scale' }, inputs:{ signature: value( '(k) => Shape' ) } } ],
		} } ),
		'if-and': instance( 'if', {
			inputs:{ condition: instance( 'and', { sections:{ operands:[
				{ inputs:{ value: instance( 'compare', { fields:{ op:'<' }, sections:{ operands:[ { inputs:{ value: value( 'a' ) } }, { inputs:{ value: value( 'b' ) } } ] } } ) } },
				{ inputs:{ value: instance( 'not', { inputs:{ operand: value( 'done' ) } } ) } },
			] } } ) },
			sections:{ then:[ { statements:[ call( 'go' ) ] } ], 'else':[ { statements:[ call( 'stop' ) ] } ] } } ),
		'function': instance( 'function', { fields:{ name:'area' }, inputs:{ params: value( 'w, h' ) },
			sections:{ body:[ { statements:[
				instance( 'while', { inputs:{ condition: value( 'n' ) }, sections:{ body:[ { statements:[ call( 'step' ) ] } ] } } ),
				instance( 'return', { inputs:{ value: value( 'w * h' ) } } ) ] } ] } } ),
	};
}

module.exports = exports = { samples, value, call, apply };
