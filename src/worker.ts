import { ErrorHandler, Hono } from 'hono';
import { cors } from 'hono/cors';
import { TaskList, CreateTask, TaskOne, updateTask, deleteTask, ListDatabase, DeleteDatabase, getStatus, init } from './api/data';
import template from './template';

interface Env {
	DB: any;
}
interface WebSocket {
	accept(): void;
	send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView): void;
	addEventListener(type: 'message', listener: (event: { data: string }) => void): void;
	addEventListener(type: 'close', listener: (event: { code: number; reason: string }) => void): void;
}
interface WebSocketPair {
	(): [WebSocket, WebSocket];
	new (): [WebSocket, WebSocket];
	prototype: [WebSocket, WebSocket];
}

const app = new Hono();
app.use(
	cors({
		origin: '*', // CORS
	})
);

let count = 0;
/** @param {WebSocket} websocket */

//appp route for worker.ts
app.get('/api', async (c) => ListDatabase(c));
app.get('/api/', async (c) => ListDatabase(c));
app.get('/api/:name_db', async (c) => TaskList(c));
app.get('/api/:name_db/:post_id', async (c) => TaskOne(c));
app.post('/api/:name_db/p', async (c) => CreateTask(c));
app.put('/api/:name_db/:id', async (c) => updateTask(c));
app.delete('/api/:name_db/:post_id', async (c) => deleteTask(c));
app.post('/api/:name_db', async (c) => init(c));
app.delete('/api/:name', async (c) => DeleteDatabase(c));
app.get('/status', async () => getStatus());



const handleSession = async (websocket: WebSocket) => {
	websocket.accept();
	websocket.addEventListener('message', async ({ data }) => {
		if (data === 'CLICK') {
			websocket.send(JSON.stringify({ count: 1, tz: new Date() }));
		} else {
			// An unknown message came into the server. Send back an error message
			websocket.send(JSON.stringify({ error: 'Unknown message received', tz: new Date() }));
		}
	});
	websocket.addEventListener('close', async evt => {
		// Handle when a client closes the WebSocket connection
		console.log(evt);
	});
};

const websocketHandler = async (req: Request) => {
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
};
//socket route for worker.ts
app.get('/ws', async (res: any) =>{
	try {
		return await websocketHandler(res);
	} catch (err: any) {
		/** @type {Error} */
		let e = err;
		return new Response(e.toString());
	}
});

app.get('/', async (c) => template(c));

app.notFound(err => {
	return new Response(JSON.stringify({
		status: err.runtime,
		error: err.req,
		massage: err
	}), { status: 404 });
});

app.onError((error: Error) => {
	return new Response(( `error ${error.message}` ), { status: 500 });
});

export default app;
