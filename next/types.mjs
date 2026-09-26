export const AnyType = Object.freeze({ kind: "any" });

export function type(kind, detail = null) {
  if (!kind) throw new Error("type kind is required");
  return Object.freeze({ kind, detail });
}

export function expression(of = AnyType) {
  return type("expression", of);
}

export function signal(of = type("number")) {
  return type("signal", of);
}

export function trigger() {
  return type("trigger");
}

export function instanceOf(name) {
  return type("instance", name);
}

export function classOf(name) {
  return type("class", name);
}

export function fn(args = [], result = AnyType) {
  return Object.freeze({ kind: "function", args, result });
}

export function sameType(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.kind !== b.kind) return false;
  if (typeof a.detail === "string" || typeof b.detail === "string") {
    return a.detail === b.detail;
  }
  if (a.detail || b.detail) return sameType(a.detail, b.detail);
  return true;
}

export function accepts(expected, actual) {
  if (!expected || !actual) return false;
  if (expected.kind === "any" || actual.kind === "any") return true;

  if (expected.kind === "object" && actual.kind === "instance") return true;
  if (expected.kind === actual.kind && expected.detail == null) return true;
  if (expected.kind === "expression") {
    if (actual.kind !== "expression") return false;
    return accepts(expected.detail || AnyType, actual.detail || AnyType);
  }
  if (expected.kind === "signal") {
    if (actual.kind !== "signal") return false;
    return accepts(expected.detail || AnyType, actual.detail || AnyType);
  }
  return sameType(expected, actual);
}

export function formatType(t) {
  if (!t) return "<missing>";
  if (t.kind === "any") return "any";
  if (t.kind === "expression") return `expression<${formatType(t.detail)}>`;
  if (t.kind === "signal") return `signal<${formatType(t.detail)}>`;
  if (t.kind === "function") {
    return `function(${t.args.map(formatType).join(", ")})->${formatType(t.result)}`;
  }
  if (t.detail) return `${t.kind}:${t.detail}`;
  return t.kind;
}
