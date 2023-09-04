// import template from "./template";

let count = 0;
/** @param {WebSocket} websocket */
async function handleSession(websocket,env) {
  websocket.accept();
  websocket.addEventListener("message", async (event) => {
    const { data, getdb } = JSON.parse(event.data);

    if (data === "GETDB") {
      const timeStart = Date.now();
      const { results } = await env.DB.prepare(`SELECT * FROM ${getdb};`).all();
      const tasks = results || [];
      websocket.send(JSON.stringify({ tasks: tasks, time: Date.now() - timeStart }));
        
    } if (data === "GET") {
      const timeStart = Date.now();
      const { results } = await env.DB.prepare(
        `select * from sqlite_master where type = 'table';`
      ).all();
      const tasks = results || [];
      websocket.send(JSON.stringify({ table: tasks, time: Date.now() - timeStart }));
    } if (data === "CREATE") {
      const timeStart = Date.now();
      const { getname , getalt, getimag, getpost_id} = JSON.parse(event.data);
      const { results } = await env.DB.prepare(
        `INSERT INTO ${getdb} (name, alt, imag, post_id) VALUES (?, ?, ?, ?);`
      ).bind(getname, getalt, getimag, getpost_id).run();
      const tasks = results || [];
      if (tasks) {
        websocket.send(JSON.stringify({ tasks: tasks, time: Date.now() - timeStart }));
      } else {
        websocket.send(JSON.stringify({ error: `${getdb} is not added`, time: Date.now() - timeStart }));
      }
    } if (data === "UPDATE") {
      const timeStart = Date.now();
      const { getname , getalt, getimag, getpost_id, getid} = JSON.parse(event.data);
      const { results } = await env.DB.prepare(
        `UPDATE ${getdb} SET name = ?, alt = ?, imag = ?, post_id = ? WHERE id = ?;`
      ).bind(getname, getalt, getimag, getpost_id, getid).run();
      const tasks = results || [];
      if (tasks) {
        websocket.send(JSON.stringify({ tasks: tasks, time: Date.now() - timeStart }));
      } else {
        websocket.send(JSON.stringify({ error: `${getdb} is not added`, time: Date.now() - timeStart }));
      }
    } if (data === "DELETE") {
      const timeStart = Date.now();
      const { getid } = JSON.parse(event.data);
      const { results } = await env.DB.prepare(
        `DELETE FROM ${getdb} WHERE id = ?;`
      ).bind(getid).run();
      const tasks = results || [];
      if (tasks) {
        websocket.send(JSON.stringify({ tasks: tasks, time: Date.now() - timeStart }));
      } else {
        websocket.send(JSON.stringify({ error: `${getdb} is not added`, time: Date.now() - timeStart }));
      }
    }
  });

  websocket.addEventListener("close", async (evt) => {
    // Handle when a client closes the WebSocket connection
    console.log(evt);
  });
}

/** @param {Request} req */
async function websocketHandler(req,env) {
  const upgradeHeader = req.headers.get("Upgrade");
  if (!upgradeHeader || upgradeHeader !== 'websocket') {
    return new Response('Expected Upgrade: websocket', { status: 426 });
  }

  // let webSocketPair = new WebSocketPair();
  let [client, server] = Object.values(new WebSocketPair());

  await handleSession(server,env);

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

export default websocketHandler;
