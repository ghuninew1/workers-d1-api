// import template from "./template";

let count = 0;
/** @param {WebSocket} websocket */
async function handleSession(websocket) {
  websocket.accept();
  websocket.addEventListener("message", async (event) => {
    // const { data, tz } = JSON.parse(event);

    const data = JSON.parse(event.data).data;
    const tz = JSON.parse(event.data).time;
    const getdb = JSON.parse(event.data).getdb;
    if (data === "GETDB") {
      fetch(`https://api.ghuninew.workers.dev/api/${getdb}`)
        .then((res) => res.json())
        .then((res) => {
          websocket.send(JSON.stringify({ tasks: res }));
        });
    }
    if (data === "CLICK") {
      count += 1;
      websocket.send(
        JSON.stringify({
          count,
          tz: new Date().toLocaleString("th"),
          time: new Date().getTime() - tz + " ms",
        })
      );
    }
    if (data === "CLICKDOWN") {
      count -= 1;
      websocket.send(
        JSON.stringify({
          count,
          tz: new Date().toLocaleString("th"),
          time: new Date().getTime() - tz + " ms",
        })
      );
    }
    if (data === "RESET") {
      count = 0;
      websocket.send(
        JSON.stringify({
          count,
          tz: new Date().toLocaleString("th"),
          time: new Date().getTime() - tz + " ms",
        })
      );
    }
  });

  websocket.addEventListener("close", async (evt) => {
    // Handle when a client closes the WebSocket connection
    console.log(evt);
  });
}

/** @param {Request} req */
async function websocketHandler(req) {
  const upgradeHeader = req.headers.get("Upgrade");
  if (upgradeHeader !== "websocket") {
    return new Response("Expected websocket", { status: 400 });
  }

  const [client, server] = Object.values(new WebSocketPair());
  await handleSession(server);

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

export default websocketHandler;
