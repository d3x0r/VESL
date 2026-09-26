import { child, input, SemanticNode } from "./semantic.mjs";
import {
  AnyType,
  classOf,
  expression,
  fn,
  instanceOf,
  signal,
  trigger,
  type,
} from "./types.mjs";

export const Types = Object.freeze({
  any: AnyType,
  number: type("number"),
  string: type("string"),
  boolean: type("boolean"),
  object: type("object"),
  statement: type("statement"),
  statementList: type("statement-list"),
  trigger: trigger(),
});

function def(spec) {
  return Object.freeze(spec);
}

export const Definitions = Object.freeze({
  literal: def({
    kind: "literal",
    output: expression(AnyType),
    props: { value: undefined },
  }),

  name: def({
    kind: "name",
    output: expression(AnyType),
    props: { name: "" },
  }),

  binary: def({
    kind: "binary",
    output: expression(AnyType),
    ports: {
      left: input("left", expression(AnyType)),
      right: input("right", expression(AnyType)),
    },
    props: { op: "+" },
  }),

  assign: def({
    kind: "assign",
    output: Types.statement,
    ports: {
      target: input("target", expression(AnyType)),
      value: input("value", expression(AnyType)),
    },
  }),

  call: def({
    kind: "call",
    output: expression(AnyType),
    ports: {
      callee: input("callee", expression(fn())),
      args: child("args", expression(AnyType)),
    },
  }),

  block: def({
    kind: "block",
    output: Types.statementList,
    ports: {
      body: child("body", Types.statement),
    },
  }),

  if: def({
    kind: "if",
    output: Types.statement,
    ports: {
      test: input("test", expression(Types.boolean)),
      then: input("then", Types.statementList),
      else: input("else", Types.statementList),
    },
  }),

  class: def({
    kind: "class",
    output: classOf(),
    ports: {
      fields: child("fields", Types.statement),
      methods: child("methods", Types.statement),
    },
    props: { name: "Anonymous", extends: null },
  }),

  classRef: def({
    kind: "class-ref",
    output: classOf(),
    props: { name: "Anonymous" },
  }),

  new: def({
    kind: "new",
    output: expression(Types.object),
    ports: {
      class: input("class", classOf()),
      args: child("args", expression(AnyType)),
    },
  }),

  method: def({
    kind: "method",
    output: Types.statement,
    ports: {
      body: input("body", Types.statementList),
    },
    props: { name: "method", args: [] },
  }),

  return: def({
    kind: "return",
    output: Types.statement,
    ports: {
      value: input("value", expression(AnyType)),
    },
  }),

  signalInput: def({
    kind: "signal-input",
    output: signal(Types.number),
    props: { name: "signal" },
  }),

  edgeTrigger: def({
    kind: "edge-trigger",
    output: Types.trigger,
    ports: {
      signal: input("signal", signal(Types.number)),
    },
    props: { threshold: 0.5 },
  }),

  onTrigger: def({
    kind: "on-trigger",
    output: Types.statement,
    ports: {
      trigger: input("trigger", Types.trigger),
      body: input("body", Types.statementList),
    },
  }),
});

export function node(kind, props = {}) {
  const definition = Definitions[kind];
  if (!definition) throw new Error(`Unknown node kind '${kind}'`);
  const instanceDefinition = { ...definition };
  if (kind === "class" && props.props?.name) {
    instanceDefinition.output = classOf(props.props.name);
  }
  if (kind === "new" && props.props?.className) {
    instanceDefinition.output = expression(instanceOf(props.props.className));
  }
  if (kind === "classRef" && props.props?.name) {
    instanceDefinition.output = classOf(props.props.name);
  }
  return new SemanticNode(instanceDefinition, props);
}
