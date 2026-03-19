import { sayHi } from "../handlers/test.js";

// Links method, path and handler together
const routes = [
  {method: "GET", path: `/test/:number`, handler: sayHi}
];

// Compiled route for speed and cleaness
export const compiled = routes.map((r) => ({
  method: r.method.toUpperCase(),
  pattern: new URLPattern({pathname: r.path}),
  handler: r.handler
}));


