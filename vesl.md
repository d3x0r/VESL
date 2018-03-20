# VESL

VESL is built from JSON as a basis.


## JSON Syntax

| symbol | comments |
|---|---|
|`{ }` |contexts : 1) object 2) code definition|
|`[]`  | context 1) array |
|`""` |           constant strings (template string not quite constant?)|
|`[-,0-9,eE[0-9]*]`, `true`, `false`, `null`  |      constants|
| `:` | separates fields and values within context of an object |
| `,` | separates fields within an object and arrays |

With the above, a simple parser that scans for `{`, `[`, `"`, `-`, `0-9` can be built 
for quick scanning structure of a JSON string.

## JSON6 Syntax

| symbol | comments |
|---|---|
|`''`, ` &#60;&#60; `                   | added other quotes   constant strings (template string not quite constant?) |
|`+`, `Infinity`, `NaN`,  `undefined`   | (+leading to numbers added) constants |
|`//`, `/* */`    | comments  |

Very minor addition in the space of handling named constants `true` and `false`, can 
add handling for other Math values that are meaningful; and allow leading + for numbers.
Also a very minor pre-scan that enables a pre-scan filter for comments hardly impacts the exsiting parsing.


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
*    (syntax below)  'identifier() [{} or ()]'

### Within an object also additionally add 

Additionally, some additional keywords handling within Objects should be added... 
getters/setters and operator overloads.
Also the previous FunctionDeclaration should be allowed within the context of an object.


GetterDeclaration
*    'get identifier()'

SetterDeclaration
*     'set identifier(value)'

OperatorDeclaration
*      'operator text'(...) ( /* depending on operator, variable arguments */ )

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
vector(a,b)( { x : a||0, y : b||0
	, scale(n)( x*=n, y*=n, this )
	, '=' (v) ( x=v.x, y=v.y, this )
	, '=' () { this }
	, '+' (v) { { x:x+v.x, y:y+v.y } }
	, '-' () { x = -x, y=-y, this }
	, '-' (v) { Vector( x-v.x, y-v.y ) }
	, add(v){ x+=v.x,y += v.y, this }
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
