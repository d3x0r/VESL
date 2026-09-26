
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

## Running

`npm install` fetches three.js (r186 or later). three.js is ES-module only
now, so `index.html` and `preview.html` import it through an import map and
expose it as the global `THREE` the rest of the code uses. Serve the folder
over http and open either page. The WebVR code path under `three.js/js/vr`
predates WebXR and is not loaded by current browsers.




