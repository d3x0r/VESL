# Block layout

Blocks used to be built by hand: every corner piece was placed with its own
offset arithmetic, and whole blocks were stitched together piece by piece in
`shapes.js`. Adding a row to a loop meant editing geometry code. This folder
replaces that with three layers, so the geometry falls out of the structure.

```
 description  ──▶  layout  ──▶  tiler  ──▶  pieces (verts/faces)  ──▶  three.js
 blockdef.js       layout.js     tiler.js    shapes/compose.js         shapes.js
                      │
                      └──▶  svg.js   (2D silhouette, no three.js needed)
```

## 1. Descriptions (`blockdef.js`)

A block kind says *what it contains*, never where anything goes:

```js
define( 'switch', {
	top:'statement', bottom:'statement',          // slot on top, tab on the bottom
	header:[ label( 'switch' ), input( 'discriminant' ) ],
	sections:[
		section( 'cases',   'fork', [ label( 'case' ), input( 'value' ), statements( 'body' ) ] ),
		section( 'default', 'fork', [ label( 'default' ), statements( 'body' ) ], { max:1 } ),
	],
} );
```

* `header` is the top bar: label and name cells, and at most one trailing
  value `input`.
* `sections` are repeatable groups of rows hanging off the left bar. Each
  entry in a section becomes one row:
  * `'input'` rows end in a value slot (object field, argument, property).
  * `'fork'` rows carry a statement tab; a body of statements hangs from it
    (case body, method body, loop body).
* `top`/`bottom: 'statement'` give the block a statement slot/tab so it can
  be stacked; `left: 'value'` gives it an output tab so it can be plugged
  into a value slot.

A first section that is a single mandatory body with nothing but statements
(`if`, `while`, `for`, `function`) merges into the header: the body hangs
from a tab under the header, blockly style, instead of a separate fork row.

Kinds defined so far: `call assign if while for switch return` (statements)
and `value apply and or not compare unary function object array struct interface class`
(values). Operators hold their operands as rows, so an expression is one
line with values plugged into it rather than a tree of inline slots.
`class` has sections for fields, constructor, methods, getters, setters and
operator overloads, which is what the VESL syntax document asks for.

An **instance** is a kind plus its contents:

```js
instance( 'class', { fields:{ name:'Point' }, sections:{
	fields:[ { fields:{ key:'x' }, inputs:{ value: instance( 'value', { fields:{ text:'0' } } ) } } ],
	methods:[ { fields:{ key:'length' }, statements:[ instance( 'return' ) ] } ],
} } )
```

## 2. Layout (`layout.js`)

`layoutBlock( instance )` walks the rows and produces rectangles:

* a `rows` list (`header`, `input`, `fork`, `headerfork`, `spacer`, `footer`)
  with `y`/`h`, each stub's width, and its text cells;
* `connectors`: every slot and tab with its position and kind, so snapping
  can test "does this tab fit that slot" from data;
* `children`: plugged-in values and hanging statements with the position
  their connector dictates; each child is a full layout node of its own.

Expansion is what this pass exists for. A statement inserted into a case body
grows that fork row; the rows below move down; the parent's height grows, and
so on up the tree. Nothing is spliced: the block is simply laid out again from
its description.

Values plugged into slots chain along the third axis: the child gets
`lift = 1` and sits one piece thickness above its parent, so a tall
expression never pushes the parent's rows apart. `metrics.liftValues = false`
switches to in-plane layout, where a tall value pushes the rows below it down.

Every section that can still take an entry ends with a **ghost row**: an
empty entry laid out like the others, tiled into `shape.ghost` and drawn
translucent, with its connectors flagged `ghost: true`. Dropping onto a ghost
connector is how a case is added to a switch or a field to a class. A section
opts out with `ghost:false`. A switch case with nothing in its value slot is
the default case.

All metrics derive from `shapes/consts.js` (`metrics` in `layout.js`).

## 3. Tiler (`tiler.js`)

`tileBlock( node )` turns one block's rectangles into the existing C-beam
pieces (swells, corners, slots, tabs, fills from `shapes/*.js`). A block is
the union of a header bar, the left bar, one stub per body row and a footer
bar; each region gets a fill plus the edge pieces its sides call for. The
offset arithmetic that used to be repeated per corner lives here once, keyed
on edge type. Children are tiled separately, since each is its own draggable
object.

`shapeToSVG( shape )` projects a tiled shape top-down for checking without
three.js; `validate( shape )` checks indices and finite vertices.

## 4. three.js (`../shapes.js`)

`shapes.buildBlock( inst )` gives `{ layout, shape }`;
`shapes.makeBlockObject( inst )` gives a `THREE.Object3D` with the mesh, its
labels, and child blocks attached where their connectors line up.

## Trying it

```
npm test                 # layout + tiler checks, no browser needed
npm run examples         # writes layout/examples/*.svg (silhouette and tiled top view)
<any static server>     # then open preview.html for the three.js view
```

`layout/samples.js` holds the sample instances used by the scene, the
preview page and the SVG examples.

## Not done yet

* Inline value slots in the middle of a row (`a + b` with both sides as
  slots). Rows support one trailing input; a binary operator block needs the
  `middleConstVar` inset style pieces wired into the tiler.
* Editing: dragging a block onto a connector should call `layoutBlock` on the
  parent again and rebuild its mesh. The connectors carry what is needed.
* Text width is estimated (`metrics.charW`); measuring real text would make
  labels fit better.
