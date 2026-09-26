// Build call blocks from what is known about a function, so the block
// offers the parameters as rows to fill in instead of anonymous slots.
//
//   callFor( 'go', [ 'x', 'y' ] )            explicit parameter names
//   callFor( someFunction )                   names read from its source
//   callFor( 'go', jsdocText )                names read from @param tags
//
// A parameter marked optional ( [name] in JSDoc, or name = default in the
// source ) is still offered; only the required ones are marked so a UI can
// insist on them.

const { instance } = require( "./blockdef.js" );

// "( a, b = 1, ...rest )" or "a => ..." -> [ { name, optional, rest } ]
function paramsFromSource( fn ) {
	const src = Function.prototype.toString.call( fn ).trim();
	let list;
	const m = src.match( /^(?:async\s*)?(?:function\b[^(]*)?\(([^)]*)\)/ ) || src.match( /^(?:async\s*)?([A-Za-z_$][\w$]*)\s*=>/ );
	if( m ) list = m[1];
	else {
		const cls = src.match( /constructor\s*\(([^)]*)\)/ );   // a class: its constructor
		list = cls ? cls[1] : '';
	}
	return list.split( ',' ).map( p => p.trim() ).filter( Boolean ).map( p => {
		const rest = p.startsWith( '...' );
		const [ name, def ] = p.replace( /^\.\.\./, '' ).split( '=' ).map( t => t.trim() );
		return { name: name.replace( /[{}\[\]\s]/g, '' ) || 'arg', optional: def !== undefined || rest, rest };
	} );
}

// @param {type} name  /  @param {type} [name=default]  /  @param name
function paramsFromJSDoc( text ) {
	const out = [];
	const re = /@param\s*(?:\{([^}]*)\}\s*)?(\[)?([\w$.]+)(?:\s*=\s*[^\]\s]+)?\]?/g;
	let m;
	while( ( m = re.exec( text ) ) ) {
		if( m[3].includes( '.' ) ) continue;   // property of an earlier object parameter
		out.push( { name: m[3], type: m[1] ? m[1].trim() : undefined, optional: !!m[2] || ( m[1] || '' ).trim().endsWith( '=' ) } );
	}
	return out;
}

function paramsOf( spec ) {
	if( Array.isArray( spec ) ) return spec.map( p => typeof p === 'string' ? { name:p } : p );
	if( typeof spec === 'function' ) return paramsFromSource( spec );
	if( typeof spec === 'string' ) return paramsFromJSDoc( spec );
	return [];
}

// kind: 'call' (a statement) or 'apply' (a value)
function callFor( callee, spec, kind ) {
	if( typeof callee === 'function' ) { spec = spec === undefined ? callee : spec; callee = callee.name || 'f'; }
	const params = paramsOf( spec );
	const inst = instance( kind || 'call', { fields:{ callee }, sections:{ args: params.map( p => ( { fields:{ key:p.name }, param:p } ) ) } } );
	inst.params = params;
	inst.sections.args.forEach( ( e, i ) => { e.param = params[i]; } );
	return inst;
}

module.exports = exports = { callFor, paramsOf, paramsFromSource, paramsFromJSDoc };
