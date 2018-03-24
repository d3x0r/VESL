# VESL

VESL (Visual EcmaScript Language)[README.md]


VESL is built from JSON(6) as a basis... so A little history.


## JSON Syntax

| symbol | comments |
|---|---|
|`{ }` |contexts : 1) object 2) code definition|
|`[]`  | context 1) array |
|`""` |           constant strings (template string not quite constant?)|
|`[-,0-9,eE[0-9]*]`, `true`, `false`, `null`  |      constants|
| `:` | separates fields and values within context of an object |
| `,` | separates fields within an object and arrays |

With the above, a simple parser that scans for `{`, `[`, `"`, `-`, `0-9`, [tfn] can be built 
for quick scanning structure of a JSON string.

## JSON6 Syntax

| symbol | comments |
|---|---|
|All JSON Above|   |
|`''`, ` &#60;&#60; `                   | added other quotes   constant strings (template string not quite constant?) |
|`+`, `.`, `Infinity`, `NaN`,  `undefined`   | (+leading to numbers added) constants |
|`//`, `/* */`    | comments  |

Very minor addition in the space of handling named constants `true` and `false`, can 
add handling for other Math values that are meaningful; and allow leading + for numbers.
Also a very minor pre-scan that enables a pre-scan filter for comments hardly impacts the exsiting parsing.

With the above, a simple parser that scans for `{`, `[`, `"`, `'`, `&#60;`, `[-,+,.,0-9]`, `[INutfn]`, `/` can be built 


## VESL Syntax

| symbol | within | comments |
|---|---|---|
| `[]`       | | frames an array of expressions.  Expressions are seprated by ',' and 'quoted' with (), {}, '', "", &#60;&#60; |
|   |   |   |
| `{}`, `()` | | frames expressions which may optionally have a name.                                                   |
| `;` or `,` | `[]` | seprates elements.  At a high level can gather string and \0 terminate here.              |
| `]`        | `[]` | ends elements, terminates last expression element and \0 terminate here.                          |
| `?`        | `{}` or `()` | ternary comparitor; next ':' is actually in expression and not name.     |
| `:` or `=` | `{}` or `()` | separates a name for the field from the value of the field.              |
| `;` or `,` | `{}` or `()` | seprates fields/expressions.  If a ':' is not before ',', value is an unnamed expression. |
| `[`        | `{}` or `()` | starts an array    |
| `(` or `[` | `{}` or `()` | starts a new framed expression with optionally named expressions.   |
|   |   |   |
| `"` `'` `&#60;` |  | string constant begin |
| `"` `'` `&#60;` | `[` | string constant begin |
| `"` `'` `&#60;` | `{` or `(` | string constant begin; break prior token as un-eval, on closoe quote link and begin new un-eval |
| `"` `'` `&#60;` | `"` `'` `&#60;` | if not prefixed with a '\' close the string constant. |
| `\\`  | `"` `'` `&#60;` | introduce special character handling escape within string.  If prefixed with an escape, is the \ itself. |
|   |   |   |
|`[0[X,x,O,o,B,b]]*[0-9,[a-,A-]]*,eE[0-9]*]` | ANY  |  A number; sometimes is float (with . and/or E).  Leave +/- operator as un-eval to be processed later. |
|   |   |   |
| (Operator)  |   | (probably just leave for phase 2) syntax break character for later processing?  String = (operator)?  |



Phase 1 Parsing : parse high level stream of symbols.  Gather into named strings of unknown type. 
  * ex: arrays contain arrays objects and primitive values. 
  * a token has contents.  These contents are separated by commas.
  * A string token does not have contents, it instead has a link to the next token(s).
Phase 2 Parsing : process expressions for operators and functions.
  * ex: 
 
Evaluation of expressions.... (see below)




## Function Extension Additional Syntax

With the above, all static data constructs can be represented, and the only thing it lacks
is code or function.  That is there's nothing that DOES anything in JSON.  So within the scope of 
JSON there are a few things that are available to fork from error condition to instead becoming meaningful.
One is an identifier as defined below in Syntax Definition and ES6; that is words that are not keywords
that are outside of quotes.  If one of these is found, then a proper name that can be a variable
can be defined.  A variable then needs to have a value `=`, so really the first new construct to add is 'Assignment'.

Assignment
*    (syntax below)  'identifier ='

The other is definitions for functions.  Functions get a set of zero or more identifiers to later
reference the passed parameters.  They also have a sequence of expressions to execute.	
	
FunctionDeclaration
*    (syntax below)  'identifier:() [{} or ()]'

With the above, a simple parser that scans for `[{(]`, `[`, `"`, `'`, `&#60;`, `[-,+,0-9]`, `[INutfn]`, `/` can be built 
For the declaration of a code fragment, ( to ) and { to } are treated as quotes, counting internal opens/closes of the same
type.  The code string will be parsed later phase.  (If that is standardized, then all paren expressions can be delay parsed)

### Within an object also additionally add 

Additionally, some additional keywords handling within Objects should be added... 
getters/setters and operator overloads.
Also the previous FunctionDeclaration should be allowed within the context of an object.


GetterDeclaration
*     get Identifier ()'

SetterDeclaration
*     'set identifier(value)'

OperatorDeclaration
*     'operator text'(...) ( /* depending on operator, variable arguments */ )

### Variadic support? 

..., expand [...arg]

### Within Function Code Expression

These operator that are valid within an Expression or Code 

All Operators, and flow control keywords

```
+ - -(unary) * / % << >> >>> <| |> = := ==(=)  
! && || 
~ & !& | !| ^ = !+ < !>= <= !> > !<= >= !< 
? :
if switch case default break while for do continue goto(?) stop 
this holder(?) base caller(?)

```

### Example Syntax

These are some example statements.  Notable things, 'var' is no longer 'required' (not that it is already I guess)
An expression with comma separators evalutes each expression delimited by the commas in order; this
is exactly the same behavior as (for example C statements separated by a semicolon instead).  
The very last expression evaluated is the result of the expression (return value of a function).
the 'stop' keyword ends execution within an expression; this allows building 'return <value>' constructs.
Comma and Semi-colon are interchangable
`{}` and `()` are (semi)interchangable; except where objects are defined.


```
// Assignment examples
var = 3
object = { asdf : 5 };
array = [ 1,2,3 ];

// function declaration examples
f()( console.log( "code goes here" ), a=3, b=a*3 );
g(){ console.log( "A more comfortable notation?" ), a=3, b=a*3 };
h(a,b) { console.log( "arguments passed", a, b ); }
i(a,b) (h)


// function invocation examples
f()
h(a,b),b=g();c=h(1,3)
(i(1,2))(3,4)

// this would call a function, and assign 5 to a variable 'a'
// if 'a' was previously a function overwrite reference.
i(3,4) a=5

// optional = to define a function?
// what's the diff between f=()() and f(){} ?
a=(a,b)(a*a+b*b)

// to invoke a function which a function returned, close the invocation in parenthesis
(i(1,2))(3,4)

// these two are not the same....
o = { a: 3 },b=3
o = ({ a: 3 },b=3)

```

## Syntax Definition 

(loosely based on ECMA Script syntax specification)
Usually an expression's value is the evaluation of the last ExpressionToken in the
expression.  Two exceptions to this, and both are very common operations, so perhaps 
this is the usual case; ArgumentsExpression is a list of identifiers, it is a symbol 
table containing all of the symbols specified, and Two the CallExpression all individual
expression parts are retained and passed to the function specified to call.

There is automatic separator Insertion `,` or `;` on newlines, rules to be expanded )


Assignment ::
*	Identifier = Expression	

FunctionDeclaration ::
*	Identifier ArgumentsExpression CodeExpression

FunctionInvocation ::
*	Identifier CallExpression NonExpression
	
NonExpression ::
*	Identifier
*	Operator
*	CloseExpression
*	LineTerminatorSequence
	
ArgumentsExpression ::
*	( Identifier [ ExprSeparator Identifier ]... )

CodeExpression ::
*	Expression
	
CallExpression ::
*	Expression; but all scalar values are passed
	
Expression :: 
*	( ExpressionToken [ ExprSeparator ExpressionToken ] )
*	{ ExpressionToken [ ExprSeparator ExpressionToken ] }

	
CloseExpression ::
*	)   // (as matching what the open of the expression was )
*	}
	
ExpressionToken ::
*	Assignment
*	FunctionDeclaration
*	FunctionInvokation
	
ExprSeparator ::
*	,
*	;
*	\n if within CodeExpression, but not within a contained Expression
	

_*incomplete reference... just you know, strings.*_
_*continue collecting until the same quote.*_
StringLiteral ::
*	" [DoubleStringCharacters]... "
*	' [SingleStringCharacters]... '
*	` [SingleTickStringCharacters] ... `

DoubleStringCharacters ::
*	DoubleStringCharacter DoubleStringCharactersopt

SingleStringCharacters ::
*	SingleStringCharacter SingleStringCharactersopt

DoubleStringCharacter ::
*	SourceCharacter but not one of " or \ or LineTerminator
*	\ EscapeSequence
*	LineContinuation


Identifier :: 
*	StringLiteral
*	IdentifierName

	
IdentifierName ::
*	IdentifierStart
*	IdentifierName IdentifierPart
	
IdentifierStart ::
*	UnicodeIDStart
*	$
*	_
*	\ UnicodeEscapeSequence

IdentifierPart ::
*	UnicodeIDContinue
*	$
*	_
*	\ UnicodeEscapeSequence
*	<ZWNJ>
*	<ZWJ>
	
UnicodeIDStart ::
*	any Unicode code point with the Unicode property ID_Start
UnicodeIDContinue ::
*	any Unicode code point with the Unicode property ID_Continue
	

LineTerminatorSequence ::
*	<LF>[lookprior =<CR> ]
*	<CR>  // not [lookahead ≠ <LF>]
*	<LS>
*	<PS>
*	<CR><LF>

PrimitiveValue ::
*	Number (float/int), NaN, Infinity
*	Boolean (true/false)
*	StringLiteral
*	null
*	undefined
	
ObjectSpecification ::
*	{ ObjectField [ ExprSeparator ObjectField] }
	
	
ObjectField
*	Identifier ':' PrimitiveValue
*	FunctionDeclaration
*	get FunctionDeclaration
*	set FunctionDeclaration
*	Identifier ':' ObjectSpecification
	
ObjectMerge ::
*	ObjectSpecification : ObjectSpecification

-------------------------------------------------

ObjectMerge provides an inheritance operator, that the object used to 
result from the first ObjectSpecification is used for the second 
ObjectSpecification's fields, resulting in a single, merged object 

The methods defined in the second ObjectSpecification may reference 'base'
which is a method by that name from the original object before overridden
with this name.  (Virtual function overload)




Some more complex methods, like how does a code bit in a function react?

```
vector()( { x : 0, y : 0
	, scale(n)( x*=n,y*=n,this )
	, add(v){ x+=v.x, y += v.y, this }
	, norm(v)(l=length, x/=l, y/=l, this )
	, get length() { Math.sqrt( x*x+y*y ) }
	, get scalar(n) { if n=0 x else y }
} )

// create a vector3 from vector overloading its methods
vector3()( (vector()) : {
	z: 0
	, scale(n) ( base.scale(n), z*=n )
	, add(v) (base.add(v),z+=v.z )
	, norm(v)(l=length, x/=l, y/=l, this )
	, get length() { Math.sqrt( x*x+y*y +z*z) }
	, get scalar(n) { if n=0 x else if(n=1) y else z }
} );


	
```

------ Operator Overload?
only if left and right operands of an overloaded type are the same object type.
(see lua?)



```
vector(a,b) { _x : a||0, _y : b||0
	, scale:(n)( x*=n, y*=n, this )
	, =: (v) ( x=v.x, y=v.y, this )
	, =: ()  this 
	, +: (v) { { x:x+v.x, y:y+v.y } }
	, -: () { x = -x, y=-y, this }
	, -: (v) { Vector( x-v.x, y-v.y ) }
	, add:(v){ x+=v.x,y += v.y, this }
	, norm:(v)( @l=length, x/=l, y/=l, this )
	, length: get() { Math.sqrt( x*x+y*y ) }
	, scalar: get(n) { if n=0 x else y }
	; (whatever expression)
	; {whatever expression}
	, meta : add( vector(1,1) )
	, norm:( this )
	, [ ...].forEach( thing=> do thing with thing )
}

// create a vector3 from vector overloading its methods
vector3(a,b,c)( vector(a,b) : {
	#z = c||0
	scale:(n) ( _scale(n), z*=n )
	add:(v) ( _add(v),z+=v.z )
	norm:(v)( #l=length, x/=l, y/=l, this )
	length :get() { Math.sqrt( x*x+y*y +z*z) }
	scalar :get(n) { if n=0 x else if(n=1) y else z }
} );


	
```

------------------------------------------------------------------

Was implementing this with only partial decomposition; which loses a lot availalbe to the first level....

So what's the symbolic structure of this stuff?

* 1) a primitive
* 2) a name ( exported by prefixing with '.' )
* 2a) = 
* 2b) :
* 2c) := 
* 2d) ( 
* 2dA)  )
* 2dB)  a name )
* 2dC)  a name [, another name]... )
* 2dD- anything not a comma `,` or a valid Identifer(string)
* 2d.1)  


* 2e) ( 
* 2eA)  )
* 2eB)  an expression )
* 2eB1)   [.] a name =
* 2eB2)   a name (other operator)
* 2eC)  an Expression [, expression]... )
* 2eD- anything not a comma `,` or a valid Identifer(string)




a name is also 'a variable reference' is name.name.name.name

-----------

## Expression List Evaluation

I feel like this is inevitably a chicken and egg definition... There are primitive types, these are grouped into expressions 
that have names mapping the values or ordered lists (array) which themselves contain just the primvimitves.  
Number, String, bool, null, undefined.  

Then expressions either result in a single primitive value, or an expression of named primites or ordered list of unnamed 
primitives. (or lists of those)...

The result of a single expression can be one of, a primitive value, an array, or an expression.  A function is a named expression
which provides names of symbols for the expression to evaluate with to be later paired with the expression used as calling
arguments.

An expression may contain an expression list.  Expression lists are expressions.

Functions are lists of expressions that have operators and operations that will be evaluated.  

Functions evaluate their opnodes in parallel with accumulator(s) for the values of the resolved expressions.

  * 1) allocate an accumulator, call expression evaluator.
  * 2) for each expression, if the expression is named, get the public/private accumulator, init to undefined, 

  * 2a) if expression is a primitive, assign to active accumulator.
  * 2b) if the expression is an expression, resolve expression with existing accumulator.
  * 2c) if expression[List] is not closed in parenthesis, advance and retain accumulators
  * 2d) 

  * if expression node is a function call....
  * 1) the existing accumulator for the current expression is passed
  * 2) the expression vector is not resolved to a single scalar, and is mapped to function's argument name definitions.
  * 3) the context of the function, the function has variables to be scoped...

  * 3a) the expression itself.  
  * 3b) All immediately defined expression containers. ( a: 1, ( b : a ) )
  * 3c) The expression containing the function definition   
  * 3c 1) ( a: 1, f()( b:a ) )
  * 3c 2) ( a: 1, f()( b:.a ) )
  * 3c 3) ( a: 1, f()( b:.a, c:., c.b*=3 ) )
  * 3d 4) ( a: 1, f:()( b:.a, c:., c.b*=3 ), g = (n)(.*n),f().b,g(5)  )


Referencing 'this' ?
* a and (.).a are equivalent.   (.) is the current accumulator.
* .a : a member in `this`.  'this' is actually the accumulator containing the current accumulator.
* ..a  : `this` containing `this`
* ...a  : `this` containing `this` containing `this` 
* ....a  : `this` containing `this` containing `this` containing `this` 

3e) universal common implementations
* All operators have universal common implementations that are used as a default if operator not found in any previous context.


0) for each expression


1) operators take the prior accumulator value, and a new value, and apply an operation, updating the accumulator..
2) functions take the prior accumulator value(!), one value or a vector of anonymous values to be matched with function parameter
declaration (?) 
3) 

## UserOperators

```
'=' 

------
test : {
	noArgs: ( 3 )
	mul1:a (.*=a)
	tern:a[,] b (.?a:b)  // ( if . then a else b )
	mul2:(a[,] b[,] c) (.*=a)
}

test.noArgs
1+test.noArgs-3
test.mul1 5
4 test.mul1 6
3 test.mul2(5)




1 3 5
1, 3, 5
1; 3; 5

*+/-
* + / -

>=

noArgs noArgs mul1 3
noArgs, noArgs, mul1 3
(noArgs) (noArgs) mul1 3

3 3 * 3

3 9
```


-----
