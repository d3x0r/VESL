"use strict";

const varSyms = ['name','v1','v2','v3','v4','v5','v6','v7','v8','v9','v10'];
const valSyms = ['#','""',"''","``",'true','false','Infinity','NaN','undefined','null','()'];
const objSyms = ['.',','];
const mathSyms = ['+','-','*','/','%','**'];
const binSyms = ['~','^','&','|','<<','>>','>>>'];
const mathEqSyms = ['+=','-=','*=','/=','%=','**='];
const binEqSyms = ['~=','^=','&=','|=','<<=','>>=','>>>='];
const logSyms = ['!','&&','||','==','===','>','<','>=','<=','!=','!==','?'];
const funcSyms = ['function','afunction','generator'];
const argSyms = ['()'];
const flowSyms = ['if','while','dowhile','until','for','switch'];
const jumpSyms = ['continue','break','return','yield'];
const unarySyms = ['-','!','~'];

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}
function m(...a) {
	var out = [];
        a.map( a=>out.concat(a) );
        arrayUnique(out);
        return out;
}

const c = {
	unit_length : 1,   // how long a '1' unit of a scalalbe is

	htab_width : 1,       // width of horizontal tab/slot
	htab_base_width : 0.35, 
	htab_height : 0.2,    // height of horizontal tab/slot
	htab_tip_width : 0.2,
	vtab_height : 0.5,    // height of vertical tab (should match top_hbar_height
	vtab_width : 0.10,    // width of vertical tab
	vtab_base_width : 0.25, 
	vtab_tip_width : 0.05,

	top_hbar_height : 0.5,
	top_hbar_blend_width : 0.5,  // a square on the left/right that merges the normal shading between the center and the edges
	top_hbar_tab_fill_height : 0.5 - 0.2, // filling the space under the tab... top_har_height - htab_height
	bot_hbar_height : 0.2,
	bot_hbar_blend_width : 0.1,  // a square on the left/right that merges the normal shading between the center and the edges
	vbar_width : 0.2,
	vbar_blend_height : 0.1,  // a square on the top/bottom that merges the normal shading between the center and the edges

	peice_depth : 0.20,    // how thick peices are.

	inset : 0.025,   // outer width of inset
        inset_pad : 0.01, // inner bevel width
        inset_depth : 0.025, // depth of inset
        
	
	swell_pad : 0.025,  // how much swell is on the sides of peices
        swell_depth : 0.25,  // percentage of peice_depth that is the slope of the swell... (replace 3/4, 1/4 multiplier constants)
        
        lValue : 0x01,  // has an input
        rValue : 0x02,  // has an output
        nValue : 0x04,  // has can have a next; but only if is the first of a line
        cValue : 0x08,  // has a child Value (for, if, while, {}, (), [] )
        ifValue : 0x10,  // has extra symbols +/- to add else, elseif conditions, has child commands
        
        
        keywords : { 
        	'define'   :{text:"DEF",    icon:null,inputs:varSyms },  // #define equivalent, make shorthand variables; allow non-recursive definition of other DEF's
        	//'non-strict' :{text:"NOT STRICT",icon:null},  // make sure code leave strict mode
        	//'#if'      :{text:"IF",     icon:null},  // #if equivalent, test defined variables?
        	'name'     :{text:null,     icon:null,inputs:m(objSyms,mathSyms,binSyms,mathEqSyms,binEqSyms,logSyms,argSyms,unarySyms)},
        	'lname'    :{text:null,     icon:null,inputs:m(['{}'],flowSyms)},
        	'let'      :{text:"LET",    icon:null,inputs:varSyms},
        	'var'      :{text:"VAR",    icon:null,inputs:varSyms},
        	'const'    :{text:"CONST",  icon:null,inputs:varSyms},
        	'if'       :{text:"IF",     icon:null,inputs:m(varSyms,unarySyms),children:m(varSyms,funcSyms,flowSyms) },
        	//'else'     :{text:"ELSE",   icon:null},  // NO right hand expression
        	//'elseif'   :{text:"ELSEIF", icon:null}, // needs expression
        	'switch'   :{text:"switch", icon:null,inputs:m(varSyms,unarySyms)}, // switch
        	//'case'     :{text:"CASE",   icon:null},  // value in a switch
        	'for'      :{text:"FOR",    icon:null,input1:m(varSyms),input2:m(varSyms,unarySyms),input3:m(varSyms)},   // for loop (non-standard parameter interface)
        	'while'    :{text:"WHILE",  icon:null,input:m(varSyms,unarySyms),children:m(varSyms,funcSyms,flowSyms) },  // while loop
        	'dowhile'  :{text:"DOWHILE",icon:null,input:m(varSyms,unarySyms),children:m(varSyms,funcSyms,flowSyms)}, // UNTIL( !n )
        	'until'    :{text:"UNTIL",  icon:null,input:m(varSyms,unarySyms),children:m(varSyms,funcSyms,flowSyms)},   // DOWHILE( !n ) 
        	'break'    :{text:"BREAK",  icon:null,input:[':'] },   // break from loop/switch-case
        	':'        :{text:":",      icon:null,input:['lname']},   // label statement of a block, can be used as parameter to break or continue
        	'return'   :{text:"RETURN", icon:null,inputs:m(varSyms,unarySyms)},  // return from function 
        	'yield'    :{text:"YIELD",  icon:null,inputs:m(varSyms,unarySyms)},  // generator yield/return
        	'function' :{text:"F()",    icon:null,inputs:varSyms},   // general function
        	'generator':{text:"F*()",   icon:null,inputs:varSyms}, // generator function
        	'afunction':{text:"=>",     icon:null,inputs:varSyms},  // arrow function
        	'='        :{text:"=",      icon:null,inputs:m(unarySyms,valSyms)},  // EQ
        	'+'        :{text:"+",      icon:null,inputs:m(valSyms,varSyms)},  // ADD
        	'!'        :{text:"!",      icon:null,inputs:m(valSyms,varSyms)},  // NOT
        	'~'        :{text:"~",      icon:null,inputs:m(valSyms,varSyms)},  // BINARY-NOT
        	'^'        :{text:"^",      icon:null,inputs:m(valSyms,varSyms)},  // XOR
        	'-'        :{text:"-",      icon:null,inputs:m(valSyms,varSyms)},  // SUB
        	'*'        :{text:"*",      icon:null,inputs:m(valSyms,varSyms)},  // MUL
        	'**'       :{text:"**",     icon:null,inputs:m(valSyms,varSyms)}, // EXP
        	'/'        :{text:"/",      icon:null,inputs:m(valSyms,varSyms)},  // DIV
        	'%'        :{text:"%",      icon:null,inputs:m(valSyms,varSyms)},  // MOD
        	'&'        :{text:"&",      icon:null,inputs:m(valSyms,varSyms)},  // AND
        	'|'        :{text:"|",      icon:null,inputs:m(valSyms,varSyms)},  // OR
        	'+='       :{text:"+=",     icon:null,inputs:m(unarySyms,valSyms,varSyms)}, // ADD-EQ
        	'-='       :{text:"-=",     icon:null,inputs:m(unarySyms,valSyms,varSyms)}, // SUB-EQ
        	'*='       :{text:"*=",     icon:null,inputs:m(unarySyms,valSyms,varSyms)}, // MUL-EQ
        	'/='       :{text:"/=",     icon:null,inputs:m(unarySyms,valSyms,varSyms)}, // DIV-EQ
        	'%='       :{text:"%=",     icon:null,inputs:m(unarySyms,valSyms,varSyms)}, // MOD-EQ
        	'&='       :{text:"&=",     icon:null,inputs:m(unarySyms,valSyms,varSyms)}, // AND-EQ
        	'|='       :{text:"|=",     icon:null,inputs:m(unarySyms,valSyms,varSyms)}, // OR-EQ
        	'.'        :{text:".",      icon:null,inputs:varSyms},  // member reference.
        	','        :{text:",",      icon:null,inputs:m(['{}','[]','()'],unarySyms,valSyms,varSyms)},  // expression separator
        	'<<'       :{text:"<<",     icon:null,inputs:m(unarySyms,valSyms,varSyms)}, // SHL
        	'>>'       :{text:">>",     icon:null,inputs:m(unarySyms,valSyms,varSyms)}, // SHR
        	'>>>'      :{text:">>>",    icon:null,inputs:m(unarySyms,valSyms,varSyms)},  // USHR -ZFILL-SHR
        	'<<='      :{text:"<<=",    icon:null,inputs:m(unarySyms,valSyms,varSyms)},  // SHL-EQ
        	'>>='      :{text:">>=",    icon:null,inputs:m(unarySyms,valSyms,varSyms)},  // SHR-EQ
        	'>>>='     :{text:">>>=",   icon:null,inputs:m(unarySyms,valSyms,varSyms)}, // USHR-EQ
        	'?'        :{text:"?",      icon:null,inputs:m(unarySyms,valSyms,varSyms)},   // ternary expression operator
        	'<'        :{text:"LT",     icon:null,inputs:m(unarySyms,valSyms,varSyms)},   // LT
        	'>'        :{text:"GT",     icon:null,inputs:m(unarySyms,valSyms,varSyms)},   // GT
        	'<='       :{text:"LTE",    icon:null,inputs:m(unarySyms,valSyms,varSyms)},  // LTE
        	'>='       :{text:"GTE",    icon:null,inputs:m(unarySyms,valSyms,varSyms)},  // GTE
                '!='       :{text:"!=",     icon:null,inputs:m(unarySyms,valSyms,varSyms)},   // NEQ
        	'=='       :{text:"==",     icon:null,inputs:m(unarySyms,valSyms,varSyms)},   // EQ(OLD)
                '!=='      :{text:"!==",    icon:null,inputs:m(unarySyms,valSyms,varSyms)},  // NEQ(NEW)
        	'==='      :{text:"===",    icon:null,inputs:m(unarySyms,valSyms,varSyms)},  // EQ(NEW)
        	'&&'       :{text:"&&",     icon:null,inputs:m(unarySyms,valSyms,varSyms)},   // LAND (LOG-AND)
        	'||'       :{text:"||",     icon:null,inputs:m(unarySyms,valSyms,varSyms)},   // LOR  (LOG-OR)
        	'()'       :{text:"(  )",   icon:null,inputs:['()','.',',']},  // sub-expression
        	'{}'       :{text:"{  }",   icon:null,inputs:null},  // object
        	'[]'       :{text:"[  ]",   icon:null,inputs:[',','.']},  // array
        	'""'       :{text:"'  '",   icon:null,inputs:['+','.']},  // string constant 1
        	"''"       :{text:'"  "',   icon:null,inputs:['+','.']},  // string constant 2
        	'``'       :{text:"`  `",   icon:null,inputs:['+','.']},  // template string
        	'#'        :{text:"#",      icon:null,inputs:m(mathSyms,binSyms,logSyms)},     // number constant
        	'NaN'      :{text:"NAN",    icon:null,inputs:m(mathSyms,binSyms,logSyms)},  // number constant
        	'Infinity' :{text:"INF",    icon:null,inputs:m(mathSyms,binSyms,logSyms)},  // number constant
        	'null'     :{text:"NULL",   icon:null,inputs:m(mathSyms,binSyms,logSyms)},  // null constant
        	'true'     :{text:"TRUE",   icon:null,inputs:m(mathSyms,binSyms,logSyms)},  // true constant
        	'false'    :{text:"FALSE",  icon:null,inputs:m(mathSyms,binSyms,logSyms)},  // false constant
        	'undefined':{text:"UND",    icon:null,inputs:m(mathSyms,binSyms,logSyms)},  // undefined constant
        	'v1'       :{text:"i",      icon:null,inputs:m(objSyms,mathSyms,binSyms,mathEqSyms,binEqSyms,logSyms,argSyms)},  // default variable name available (Abstract Icon 1)
        	'v2'       :{text:"j",      icon:null,inputs:m(objSyms,mathSyms,binSyms,mathEqSyms,binEqSyms,logSyms,argSyms)},  // default variable name available (Abstract Icon 2)
        	'v3'       :{text:"k",      icon:null,inputs:m(objSyms,mathSyms,binSyms,mathEqSyms,binEqSyms,logSyms,argSyms)},  // default variable name available (Abstract Icon 3)
        	'v4'       :{text:"l",      icon:null,inputs:m(objSyms,mathSyms,binSyms,mathEqSyms,binEqSyms,logSyms,argSyms)},  // default variable name available (Abstract Icon 4)
        	'v5'       :{text:"x",      icon:null,inputs:m(objSyms,mathSyms,binSyms,mathEqSyms,binEqSyms,logSyms,argSyms)},  // default variable name available (Abstract Icon 5)
        	'v6'       :{text:"y",      icon:null,inputs:m(objSyms,mathSyms,binSyms,mathEqSyms,binEqSyms,logSyms,argSyms)},  // default variable name available (Abstract Icon 6)
        	'v7'       :{text:"z",      icon:null,inputs:m(objSyms,mathSyms,binSyms,mathEqSyms,binEqSyms,logSyms,argSyms)},  // default variable name available (Abstract Icon 7)
        	'v8'       :{text:"w",      icon:null,inputs:m(objSyms,mathSyms,binSyms,mathEqSyms,binEqSyms,logSyms,argSyms)},  // default variable name available (Abstract Icon 8)
        	'v9'       :{text:"p",      icon:null,inputs:m(objSyms,mathSyms,binSyms,mathEqSyms,binEqSyms,logSyms,argSyms)},  // default variable name available (Abstract Icon 9)
        	'v10'      :{text:"q",      icon:null,inputs:m(objSyms,mathSyms,binSyms,mathEqSyms,binEqSyms,logSyms,argSyms)},  // default variable name available (Abstract Icon 10)
                indexOf( kw ) { 
                	let words = Object.keys( this );
                        let n;
                        for( n = 0; n < words.length; n++ )
                        	if( kw === this[n] )
                                	return n;
                        return -1;
                },
                nameOf( kw ) { 
                	let words = Object.keys( this );
                        let n;
                        for( n = 0; n < words.length; n++ )
                        	if( kw === this[words[n]] )
                                	return words[n];
                        return null;
                }
	},
        groups : {
        	flow : ['if','for','while','until','dowhile','switch','break','continue', ':'],
                values : ['#','""',"''",'``','NaN','Infinity','null','true','false','undefined'],
                math : ['+','-','*','/','%','**','()',{ assignment:['=','+=','-=','*=','/=','%=','**='] } ],
                binary : ['&','|','^','~','>>','<<','>>>', { assignment: ['=','&=','|=','^=','~=','>>=','<<=','>>>='] } ],
                logical : ['!','&&','||','>','<','<=','>=','==','==='],
                object : ['.',',','{}','[]'],
                function : ['define','function','afunction','generator','return','yield'],
                variables : [{'default':['v1','v2','v3','v4','v5','v6','v7','v8','v9','v10']},{user:[]}],
                
        },
	deepFreeze : deepFreeze,
	normalizeNorms : normalizeNorms,
};

function init() {
	c.keywords['name'].flags = c.lValue | c.rValue | c.nValue;
        
	c.keywords['define'].flags = c.lValue | c.nValue;
        //c.keywords['define'].
        
}

init();

function normalizeNorms( shape ) {
	let keys = Object.keys(shape);
	//console.log( "keys:", keys, keys.length );
	let n;

	for( n = 0; n < keys.length; n++ ) {
		let frag = shape[keys[n]].norms;
		if( !frag ) return;
		//console.log( keys[n], frag );
		for( let m = 0; m < frag.length; m++ ) {
			let norm = frag[m];
			let l = Math.sqrt( ( norm.x * norm.x ) + ( norm.y * norm.y ) + ( norm.z * norm.z ) );
			norm.x /= l;
			norm.y /= l;
			norm.z /= l;
		}
		//console.log( keys[n], frag );
	}
}

function _deepFreeze(o, exceptions, level) {
		
	//console.log( "TYPEOF O : ", typeof o, o instanceof Array );
	if( o instanceof Array ) {
		let n;
		for( n = 0; n < o.length; n++ ) {
			_deepFreeze( o[n], exceptions, level+1 );
		}
		Object.freeze( o );
	} else if( typeof o === "object" && o ) {
		let keys = Object.keys(o);
		//console.log( "keys:", keys, keys.length );
		let n;
	
		nextkey: for( n = 0; n < keys.length; n++ ) {
			if( level == 0 ) {
				o.name = keys[n];
				console.log( "Sealing : " + level + " " + keys[n] );
				//console.log( "something:" + JSON.stringify( o[keys[n]] ) );
			}
			let m;
			if( exceptions ) for( m = 0; m < exceptions.length; m++ )
				if( exceptions[m] === o[keys[n]] )
					continue nextkey;
			_deepFreeze( o[keys[n]], exceptions, level+1 );
		}
		Object.freeze(o);
	}
}

function deepFreeze(o, exceptions) {
	_deepFreeze(o, exceptions, 0 );
}

_deepFreeze( c, [c.groups.variables[1].user], 1 );

module.exports = exports = c;


//Object.seal(exports.keywords);
//Object.seal(exports.groups);
//Object.seal(exports);

