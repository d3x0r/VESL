# VESL next core

This directory is a clean semantic prototype for VESL. It intentionally does not depend on the older 2D, 3D, parser, or shape experiments.

The split is:

- `VisualPiece`: a 2D or 3D handle with pose/model information.
- `SemanticNode`: the language object with typed ports, child lists, and properties.
- `RuntimeNode`: optional live computation, such as an Automaton-style signal node.
- `js-emitter`: a backend that prints JavaScript from the semantic graph.

The model treats blocks as a typed physical AST rather than as loose blueprint nodes. A socket can reject mismatched ports before anything is emitted.

Signals and sequenced code meet through explicit bridge nodes:

- `signal<number>` carries continuous values.
- `edge-trigger` turns a threshold crossing into a `trigger`.
- `on-trigger` turns that trigger into ordinary sequenced statements.

Run the demo:

```powershell
node .\next\examples\demo.mjs
```
