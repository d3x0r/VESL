
<div class="align-center">
#VESL
##Visual ECMA Script Language
</div>

This is a visual programming language that represents all the core concepts of ECMA Script (6) making it a more general 
purpose VPL than others.

## Block layout

Blocks are no longer assembled piece by piece. A block kind is described by
what it contains (header cells, repeatable rows of inputs or statement forks),
a layout pass turns that into rectangles and connectors, and a tiler maps the
rectangles onto the C-beam pieces. Classes, structs, interfaces and object
literals are described this way alongside `switch`, `if`, `for` and calls.
See [layout/README.md](layout/README.md); `npm test` runs the layout checks
and `preview.html` shows the sample blocks in three.js.




