function requiredInput(node, name) {
  const value = node.inputs.get(name);
  if (!value) throw new Error(`${node.kind}.${name} is not connected`);
  return value;
}

function childList(node, name) {
  return node.children.get(name) || [];
}

export function emitJs(node) {
  switch (node.kind) {
    case "literal":
      return JSON.stringify(node.props.value);

    case "name":
      return node.props.name;

    case "binary":
      return `(${emitJs(requiredInput(node, "left"))} ${node.props.op} ${emitJs(requiredInput(node, "right"))})`;

    case "assign":
      return `${emitJs(requiredInput(node, "target"))} = ${emitJs(requiredInput(node, "value"))};`;

    case "block":
      return childList(node, "body").map(emitJs).join("\n");

    case "if": {
      const thenBody = indent(emitJs(requiredInput(node, "then")));
      const elseNode = node.inputs.get("else");
      const elsePart = elseNode ? ` else {\n${indent(emitJs(elseNode))}\n}` : "";
      return `if (${emitJs(requiredInput(node, "test"))}) {\n${thenBody}\n}${elsePart}`;
    }

    case "class": {
      const parent = node.props.extends ? ` extends ${node.props.extends}` : "";
      const fields = childList(node, "fields").map((field) => indent(emitJs(field))).join("\n");
      const methods = childList(node, "methods").map((method) => indent(emitJs(method))).join("\n");
      const body = [fields, methods].filter(Boolean).join("\n");
      return `class ${node.props.name}${parent} {\n${body}\n}`;
    }

    case "class-ref":
      return node.props.name;

    case "new":
      return `new ${emitJs(requiredInput(node, "class"))}(${childList(node, "args").map(emitJs).join(", ")})`;

    case "method":
      return `${node.props.name}(${node.props.args.join(", ")}) {\n${indent(emitJs(requiredInput(node, "body")))}\n}`;

    case "return":
      return `return ${emitJs(requiredInput(node, "value"))};`;

    case "signal-input":
      return node.props.name;

    case "edge-trigger":
      return `edge(${emitJs(requiredInput(node, "signal"))}, ${node.props.threshold})`;

    case "on-trigger":
      return `on(${emitJs(requiredInput(node, "trigger"))}, () => {\n${indent(emitJs(requiredInput(node, "body")))}\n});`;

    default:
      throw new Error(`No JS emitter for '${node.kind}'`);
  }
}

function indent(text) {
  if (!text) return "";
  return text
    .split("\n")
    .map((line) => (line ? `  ${line}` : line))
    .join("\n");
}
