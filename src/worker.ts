import { Hono } from 'hono';
import { cors } from 'hono/cors';
import {
	TaskList,
	CreateTask,
	TaskOne,
	updateTask,
	deleteTask,
	ListDatabase,
	DeleteDatabase,
	getStatus,
	init,
} from './api/data';

interface Env {
	DB: any;
	c: any;
}

const app = new Hono();
app.use(cors({
    origin: '*', // CORS
}));

//appp route for worker.ts
app.get('/api', async  c => ListDatabase(c));
app.get('/api/', async c => ListDatabase(c));
app.get('/api/:name_db', async c => TaskList(c));
app.get('/api/:name_db/:post_id', async c => TaskOne(c));
app.post('/api/:name_db/p', async c => CreateTask(c));
app.put('/api/:name_db/:id', async c => updateTask(c));
app.delete('/api/:name_db/:post_id', async c => deleteTask(c));
app.post('/api/:name_db', async c => init(c));
app.delete('/api/:name', async c => DeleteDatabase(c));
app.get('/status',async () => getStatus());
app.get('/', async () => getStatus());

app.notFound((error: any) => {
		return new Response(JSON.stringify({
			error: error,
			message: 'Not Found 404',
		 }), { status: 404 });
});
app.onError((error: Error) => {
		return new Response(JSON.stringify({
			 error: error.message,
			 message: 'Something went wrong code 500',
			}), { status: 500 });
});

export default app;
