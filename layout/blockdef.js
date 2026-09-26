// Block descriptions.
//
// A block is described by *what it contains*, never by coordinates:
//
//   header   : one row of cells across the top bar (label/name cells and at
//              most one trailing value input).
//   sections : repeatable groups of body rows hanging off the left bar.
//              Each section entry becomes one row. A row is either
//                'input' : a stub ending in a value slot (object field,
//                          argument, property...) or
//                'fork'  : a statement tab that a body of statements hangs
//                          from (case body, method body, loop body...).
//   top      : 'statement' -> this block has a slot on top so it can be
//              stacked under another statement; 'none' otherwise.
//   left     : 'value' -> this block has an output tab on its left, so it
//              can be plugged into a value slot; 'none' otherwise.
//   bottom   : 'statement' -> has a tab on the bottom for the next statement.
//
// layout.js turns a description plus an instance (field text, plugged-in
// children) into rectangles; tiler.js turns rectangles into C-beam pieces.

function label( text )            { return { type:'label', text }; }
function name( field, hint )      { return { type:'name', field, hint: hint || field }; }
function input( slot )            { return { type:'input', slot }; }
function statements( slot )       { return { type:'statements', slot }; }

function section( name, kind, cells, opts ) {
	return Object.assign( { name, kind, cells, min:0, max:Infinity }, opts );
}

const defs = {};
function define( kind, def ) {
	def.kind = kind;
	def.top = def.top || 'none';
	def.left = def.left || 'none';
	def.bottom = def.bottom || 'none';
	def.header = def.header || [];
	def.sections = def.sections || [];
	for( const s of def.sections ) {
		if( s.kind === 'fork' && !s.cells.some( c=>c.type==='statements' ) )
			throw new Error( kind + ": fork section '" + s.name + "' needs a statements cell" );
		if( s.kind === 'input' && s.cells.filter( c=>c.type==='input' ).length !== 1 )
			throw new Error( kind + ": input section '" + s.name + "' needs exactly one input cell" );
	}
	if( def.header.filter( c=>c.type==='input' ).length > 1 )
		throw new Error( kind + ": header supports at most one input (must be last)" );
	defs[kind] = def;
	return def;
}

// ---- statements -----------------------------------------------------------

define( 'call', {
	top:'statement', bottom:'statement',
	header:[ name( 'callee', 'f' ) ],
	sections:[ section( 'args', 'input', [ name( 'key', 'arg' ), input( 'value' ) ] ) ],
} );

define( 'assign', {
	top:'statement', bottom:'statement',
	header:[ name( 'target', 'x' ), label( '=' ), input( 'value' ) ],
} );

define( 'if', {
	top:'statement', bottom:'statement',
	header:[ label( 'if' ), input( 'condition' ) ],
	sections:[
		section( 'then', 'fork', [ statements( 'body' ) ], { min:1, max:1 } ),
		section( 'elseif', 'fork', [ label( 'else if' ), input( 'condition' ), statements( 'body' ) ] ),
		section( 'else', 'fork', [ label( 'else' ), statements( 'body' ) ], { max:1 } ),
	],
} );

define( 'while', {
	top:'statement', bottom:'statement',
	header:[ label( 'while' ), input( 'condition' ) ],
	sections:[ section( 'body', 'fork', [ statements( 'body' ) ], { min:1, max:1 } ) ],
} );

define( 'for', {
	top:'statement', bottom:'statement',
	header:[ label( 'for' ), name( 'variable', 'v' ), label( 'of' ), input( 'iterable' ) ],
	sections:[ section( 'body', 'fork', [ statements( 'body' ) ], { min:1, max:1 } ) ],
} );

define( 'switch', {
	top:'statement', bottom:'statement',
	header:[ label( 'switch' ), input( 'discriminant' ) ],
	sections:[
		section( 'cases', 'fork', [ label( 'case' ), input( 'value' ), statements( 'body' ) ] ),
		section( 'default', 'fork', [ label( 'default' ), statements( 'body' ) ], { max:1 } ),
	],
} );

define( 'return', {
	top:'statement',
	header:[ label( 'return' ), input( 'value' ) ],
} );

// ---- values ---------------------------------------------------------------

// a literal or a variable reference: one row, one text cell
define( 'value', {
	left:'value',
	header:[ name( 'text', '?' ) ],
} );

// a call used as a value: same rows as 'call', but it plugs into a slot
define( 'apply', {
	left:'value',
	header:[ name( 'callee', 'f' ) ],
	sections:[ section( 'args', 'input', [ name( 'key', 'arg' ), input( 'value' ) ] ) ],
} );

// Operators are single blocks holding their operands as rows, so an
// expression is one line with values plugged in, never a nested tree of
// inline slots. `and`/`or` take any number of operands.
define( 'and', {
	left:'value',
	header:[ label( 'and' ) ],
	sections:[ section( 'operands', 'input', [ input( 'value' ) ], { min:2 } ) ],
} );

define( 'or', {
	left:'value',
	header:[ label( 'or' ) ],
	sections:[ section( 'operands', 'input', [ input( 'value' ) ], { min:2 } ) ],
} );

define( 'not', {
	left:'value',
	header:[ label( 'not' ), input( 'operand' ) ],
} );

// a < b, a == b ...: the operator is a name cell so it can be swapped
define( 'compare', {
	left:'value',
	header:[ name( 'op', '<' ) ],
	sections:[ section( 'operands', 'input', [ input( 'value' ) ], { min:2, max:2 } ) ],
} );

define( 'unary', {
	left:'value',
	header:[ name( 'op', '!' ), input( 'operand' ) ],
} );

define( 'function', {
	left:'value',
	header:[ label( 'function' ), name( 'name', '' ), input( 'params' ) ],
	sections:[ section( 'body', 'fork', [ statements( 'body' ) ], { min:1, max:1 } ) ],
} );

define( 'object', {
	left:'value',
	header:[ label( '{ }' ) ],
	sections:[ section( 'fields', 'input', [ name( 'key' ), input( 'value' ) ] ) ],
} );

define( 'array', {
	left:'value',
	header:[ label( '[ ]' ) ],
	sections:[ section( 'items', 'input', [ input( 'value' ) ] ) ],
} );

// Structures / interfaces / classes: the things that were missing.

define( 'struct', {
	left:'value',
	header:[ label( 'struct' ), name( 'name', 'Name' ) ],
	sections:[ section( 'fields', 'input', [ name( 'key' ), label( ':' ), input( 'type' ) ] ) ],
} );

define( 'interface', {
	left:'value',
	header:[ label( 'interface' ), name( 'name', 'Name' ), label( 'extends' ), input( 'base' ) ],
	sections:[
		section( 'properties', 'input', [ name( 'key' ), label( ':' ), input( 'type' ) ] ),
		section( 'methods', 'input', [ name( 'key' ), input( 'signature' ) ] ),
	],
} );

define( 'class', {
	left:'value',
	header:[ label( 'class' ), name( 'name', 'Name' ), label( 'extends' ), input( 'base' ) ],
	sections:[
		section( 'fields', 'input', [ name( 'key' ), label( '=' ), input( 'value' ) ] ),
		section( 'constructor', 'fork', [ label( 'constructor' ), input( 'params' ), statements( 'body' ) ], { max:1 } ),
		section( 'methods', 'fork', [ name( 'key' ), input( 'params' ), statements( 'body' ) ] ),
		section( 'getters', 'fork', [ label( 'get' ), name( 'key' ), statements( 'body' ) ] ),
		section( 'setters', 'fork', [ label( 'set' ), name( 'key' ), input( 'params' ), statements( 'body' ) ] ),
		section( 'operators', 'fork', [ label( 'operator' ), name( 'op', '+' ), input( 'params' ), statements( 'body' ) ] ),
	],
} );

// An instance is the thing you lay out: a def plus its contents.
//   fields   : { fieldName : text }
//   inputs   : { slotName : instance | null }       (header inputs)
//   sections : { sectionName : [ entry, ... ] }
//   entry    : { fields, inputs, statements:[ instance, ... ] }
function instance( kind, spec ) {
	const def = typeof kind === 'string' ? defs[kind] : kind;
	if( !def ) throw new Error( "unknown block kind: " + kind );
	spec = spec || {};
	const inst = { def, fields: spec.fields || {}, inputs: spec.inputs || {}, sections: {} };
	for( const s of def.sections ) {
		let given = ( spec.sections && spec.sections[s.name] ) || [];
		if( !Array.isArray( given ) ) given = [ given ];
		const entries = given.map( e => ( { fields: e.fields || {}, inputs: e.inputs || {}, statements: e.statements || [] } ) );
		while( entries.length < s.min ) entries.push( { fields:{}, inputs:{}, statements:[] } );
		if( entries.length > s.max ) throw new Error( def.kind + ": too many '" + s.name + "' entries" );
		inst.sections[s.name] = entries;
	}
	return inst;
}

// The header text a block shows, used for widths and labels.
function cellText( cell, fields ) {
	if( cell.type === 'label' ) return cell.text;
	if( cell.type === 'name' ) {
		const v = fields[cell.field];
		return ( v === undefined || v === null || v === '' ) ? cell.hint : String( v );
	}
	return '';
}

module.exports = exports = { defs, define, instance, section, label, name, input, statements, cellText };
