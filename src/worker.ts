import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { etag } from 'hono/etag'
import { logger } from 'hono/logger';
import { TaskList, CreateTask, TaskOne, updateTask, deleteTask, ListDatabase, DeleteDatabase, init } from './api/data';

export interface Env {
	DB: any;
}


const app = new Hono();

// Add X-Response-Time header
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  c.header('X-Response-Time', `${ms}ms`)
  c.header('X-powered-By', `GhuniNew`)
	c.header('Accept-Encoding', 'gzip, deflate, br')
})

// Mount Builtin Middleware
app.use(logger(), cors({origin: '*'}), etag());

// Custom Not Found Message
app.notFound((c) => c.json({
	message: 'Not Found By GhuniNew',
	stats: c.req,
}, 404))


// Error handling
app.onError((err, c) => c.json({
	name: err.name,
	message: err.message,
	stack: err.stack,
	console: c.req,
}, 500))

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

//cloudflare request cf status
app.get('/', (c) => {
	const cf = c.req.raw.cf;
	return c.jsonT(cf);
})


export default app;
