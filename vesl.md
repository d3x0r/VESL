# VESL

VESL is built from JSON as a basis.


## JSON(6) Syntax

`{ }` contexts : 1) object 2) code definition

`[]`   context 1) array 

`""`, `''`, `\`\``                      constant strings (template string not quite constant?)

[-,0-9,eE[0-9]*], true, false, null        constants

## JSON6 Syntax

'', ``                          constant strings (template string not quite constant?)

+, Infinity, NaN,  undefined    constants

//, /* */     comments  



## Function Extension Additional Syntax

Assignment

FunctionDeclaration

### Within an object also additionally add 

GetterDeclaration

SetterDeclaration

OperatorDeclaration

### Within Function Code Expression

These operator that are valid within an Expression or Code 

/* All Operators, and flow control keywords */
+ - -(unary) * / % << >> >>> <| |> = := ==(=)  
! && || 
~ & !& | !| ^ = !+ < !>= <= !> > !<= >= !< 
? :
if switch case default break while for do continue goto(?) stop 
this holder(?) base caller(?)

 ['+']  no data, contains[n] things to add


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
	Identifier = Expression	

FunctionDeclaration ::
	Identifier ArgumentsExpression CodeExpression

FunctionInvocation ::
	Identifier CallExpression NonExpression
	
NonExpression ::
	Identifier
	Operator
	CloseExpression
	LineTerminatorSequence
	
ArgumentsExpression ::
	( Identifier [ ExprSeparator Identifier ]... )

CodeExpression ::
	Expression
	
CallExpression ::
	Expression; but all scalar values are passed
	
Expression :: 
	( ExpressionToken [ ExprSeparator ExpressionToken ] )
	{ ExpressionToken [ ExprSeparator ExpressionToken ] }

	
CloseExpression ::
	)   // (as matching what the open of the expression was )
	}
	
ExpressionToken ::
	Assignment
	FunctionDeclaration
	FunctionInvokation
	
ExprSeparator ::
	,
	;
	\n if within CodeExpression, but not within a contained Expression
	
Identifier :: 
	StringLiteral
	IdentifierName

	
IdentifierName ::
	IdentifierStart
	IdentifierName IdentifierPart
	
IdentifierStart ::
	UnicodeIDStart
	$
	_
	\ UnicodeEscapeSequence

IdentifierPart ::
	UnicodeIDContinue
	$
	_
	\ UnicodeEscapeSequence
	<ZWNJ>
	<ZWJ>
	
UnicodeIDStart ::
	any Unicode code point with the Unicode property ID_Start
UnicodeIDContinue ::
	any Unicode code point with the Unicode property ID_Continue
	

LineTerminatorSequence ::
	<LF>[lookprior =<CR> ]
	<CR>  // not [lookahead ≠ <LF>]
	<LS>
	<PS>
	<CR><LF>

PrimitiveValue ::
	Number (float/int), NaN, Infinity
	Boolean (true/false)
	StringLiteral
	null
	undefined
	
ObjectSpecification ::
	{ ObjectField [ ExprSeparator ObjectField] }
	
	
ObjectField
	Identifier ':' PrimitiveValue
	FunctionDeclaration
	get FunctionDeclaration
	set FunctionDeclaration
	Identifier ':' ObjectSpecification
	
ObjectMerge ::
	ObjectSpecification : ObjectSpecification

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
