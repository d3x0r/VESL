import { node, Types } from "../definitions.mjs";
import { emitJs } from "../js-emitter.mjs";
import { expression } from "../types.mjs";

const Vector3 = node("class", { props: { name: "Vector3" } });
Vector3.output = { kind: "class", detail: "Vector3" };

const lengthMethod = node("method", { props: { name: "length", args: [] } });
const body = node("block");
const x = node("name", { props: { name: "this.x" } });
const y = node("name", { props: { name: "this.y" } });
const z = node("name", { props: { name: "this.z" } });
const xx = node("binary", { props: { op: "*" } }).connect("left", x).connect("right", x);
const yy = node("binary", { props: { op: "*" } }).connect("left", y).connect("right", y);
const zz = node("binary", { props: { op: "*" } }).connect("left", z).connect("right", z);
const sum = node("binary", { props: { op: "+" } })
  .connect("left", node("binary", { props: { op: "+" } }).connect("left", xx).connect("right", yy))
  .connect("right", zz);
body.append("body", node("return").connect("value", sum));
lengthMethod.connect("body", body);
Vector3.append("methods", lengthMethod);

const sensor = node("signalInput", { props: { name: "sensorValue" } });
const edge = node("edgeTrigger", { props: { threshold: 0.5 } }).connect("signal", sensor);
const eventBody = node("block");
const fired = node("name", { props: { name: "didFire" } });
const yes = node("literal", { props: { value: true } });
yes.output = expression(Types.boolean);
eventBody.append("body", node("assign").connect("target", fired).connect("value", yes));
const event = node("onTrigger").connect("trigger", edge).connect("body", eventBody);

const makeVector = node("new", { props: { className: "Vector3" } })
  .connect("class", node("classRef", { props: { name: "Vector3" } }))
  .append("args", node("literal", { props: { value: 1 } }))
  .append("args", node("literal", { props: { value: 2 } }))
  .append("args", node("literal", { props: { value: 3 } }));
const createVector = node("assign")
  .connect("target", node("name", { props: { name: "v" } }))
  .connect("value", makeVector);

console.log(emitJs(Vector3));
console.log("");
console.log(emitJs(createVector));
console.log("");
console.log(emitJs(event));
