// Set the content type of the request to text/html
export function htmlResponse(data, init) {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "text/html; charset=utf-8");
  return new Response(data, { ...headers, init });
}

// Set the content type of the request to application/json
export function json(data, init) {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data), { ...headers, init });
}

// Set the content type of the request to application/json
export function blobResponse(data, init) {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/octet-stream");
  return new Response(data, { ...headers, init });
}
