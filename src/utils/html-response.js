// Set the content type of the request to text/html
export function htmlResponse(data, init) {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "text/html; charset=utf-8");
  return new Response(data, { ...headers, init });
}
