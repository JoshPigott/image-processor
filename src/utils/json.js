// Set the content type of the request to application/json
export function json(data, init) {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data), { ...headers, init });
}
