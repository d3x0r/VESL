import { accepts, formatType } from "./types.mjs";

let nextId = 1;

export class Port {
  constructor(name, acceptsType, role = "input") {
    this.name = name;
    this.accepts = acceptsType;
    this.role = role;
  }
}

export class SemanticNode {
  constructor(definition, props = {}) {
    this.id = props.id || `n${nextId++}`;
    this.kind = definition.kind;
    this.label = props.label || definition.label || definition.kind;
    this.ports = definition.ports || {};
    this.output = definition.output || null;
    this.emit = definition.emit || null;
    this.props = { ...(definition.props || {}), ...(props.props || {}) };
    this.inputs = new Map();
    this.children = new Map();
  }

  connect(portName, node) {
    const port = this.ports[portName];
    if (!port) throw new Error(`${this.kind} has no port '${portName}'`);
    if (port.role === "child") {
      throw new Error(`${this.kind}.${portName} is a child list, not an input`);
    }
    if (!node.output) {
      throw new Error(`${node.kind} has no output for ${this.kind}.${portName}`);
    }
    if (!accepts(port.accepts, node.output)) {
      throw new Error(
        `Cannot connect ${node.kind}:${formatType(node.output)} to ` +
          `${this.kind}.${portName}:${formatType(port.accepts)}`
      );
    }
    this.inputs.set(portName, node);
    return this;
  }

  append(portName, node) {
    const port = this.ports[portName];
    if (!port) throw new Error(`${this.kind} has no port '${portName}'`);
    if (port.role !== "child") {
      throw new Error(`${this.kind}.${portName} is an input, not a child list`);
    }
    if (!node.output) {
      throw new Error(`${node.kind} has no output for ${this.kind}.${portName}`);
    }
    if (!accepts(port.accepts, node.output)) {
      throw new Error(
        `Cannot append ${node.kind}:${formatType(node.output)} to ` +
          `${this.kind}.${portName}:${formatType(port.accepts)}`
      );
    }
    const list = this.children.get(portName) || [];
    list.push(node);
    this.children.set(portName, list);
    return this;
  }
}

export class VisualPiece {
  constructor(node, pose = {}) {
    this.id = `p:${node.id}`;
    this.node = node;
    this.pose = {
      x: pose.x || 0,
      y: pose.y || 0,
      z: pose.z || 0,
      rx: pose.rx || 0,
      ry: pose.ry || 0,
      rz: pose.rz || 0,
    };
    this.model = pose.model || null;
  }
}

export function input(name, acceptsType) {
  return new Port(name, acceptsType, "input");
}

export function child(name, acceptsType) {
  return new Port(name, acceptsType, "child");
}
