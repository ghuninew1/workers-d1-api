import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { 
	jsonReply, 
	TaskList, 
	CreateTask, 
	TaskOne, 
	updateTask, 
	deleteTask, 
	deleteAllTask, 
	CreateNewDatabase,
	ListDatabase,
	DeleteDatabase,
	getStatus,
} from './api/data';

export interface Data {
    id: number;
    name: string;
    alt: string;
    imag: string;
    post_id: number;
}
export interface Env {
    DB: D1Database;
}

const app = new Hono();
app.use(cors({
    origin: '*', // CORS
}));

//appp route for worker.ts
app.get('/api', (c: any) => ListDatabase(c));
app.get('/api/', (c: any) => ListDatabase(c));
app.get('/api/:name', async (c: any) => TaskList(c));
app.get('/api/:name/:post_id', async (c: any) => TaskOne(c));
app.post('/api/data/', async (c: any) => CreateTask(c));
app.put('/api/data/:post_id', async (c: any) => updateTask(c));
app.delete('/api/data/:post_id', async (c: any) => deleteTask(c));
app.delete('/api/data/', async (c: any) => deleteAllTask(c));
app.get('/api/:name', (c: any) => CreateNewDatabase(c));
app.get('/api/:name', (c: any) => DeleteDatabase(c));
app.get('/status', (c: any) => getStatus(c));
app.get('/', (c: any) => getStatus(c));

app.notFound((c:any) => jsonReply(c, 404));
app.onError((err: Error, c: any) => {
	console.error(`${err}`);
	return jsonReply(err.toString());
});

export default app;