// import template from "./template"
 
  async function handleSession(ws) {
    ws.accept();
    let count = 0;

    ws.addEventListener('message', async (event) => {

      if (ws.event === 'CLICK') {
        count += 1;
        ws.send(JSON.stringify({ count, tz: new Date() }));
      } if(ws.event === 'CLICKUN') {
        count -= 1;
        // An unknown message came into the server. Send back an error message
        ws.send(JSON.stringify({ error: 'Unknown message received', tz: new Date() }));
      }
    });
    ws.addEventListener('open', async (res,req) => {

    });


  
    ws.addEventListener('close', async event => {
      // Handle when a client closes the WebSocket connection
      console.log(event);
    });
  }


async function websocketHandler(req) {
	const upgradeHeader = req.headers.get('Upgrade');
	if (upgradeHeader !== 'websocket') {
		return new Response('Expected websocket', { status: 400 });
	}
	const [client, server] = Object.values(new WebSocketPair());
	await handleSession(server);

	return new Response(null, {
		status: 101,
		webSocket: client,
	});
}

export default websocketHandler;
	// async fetch(req) {
	// 	try {
	// 				return await websocketHandler(req);
	// 		} catch (err) {
  //       return new Response(err.stack || err);
  //     }
  //   },
  // };
