// GET requests to /filename would return "Hello, world!"
export const onRequestGet = () => {
  return new Response("Hello, world!");
};

// POST requests to /filename with a JSON-encoded body would return "Hello, <name>!"
export const onRequestPost = async ({ request }) => {
  const data = await request.json();
  console.log(data);
  return new Response(`Hello, you donated data!`);
};
