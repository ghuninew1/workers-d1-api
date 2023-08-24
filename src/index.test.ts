import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { etag } from 'hono/etag';
import corsOptions from './utils/cors';
import data from './api/data';
import cache from './utils/cache';
import { toHtml } from './utils/toHtml';

const app = new Hono();

// Add X-Response-Time header
app.use('*', async (c, next) => {
	cache(c, false);
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	c.header('X-Response-Time', `${ms}ms`);
	c.header('X-powered-By', `GhuniNew`);
});

// Mount Builtin Middleware
app.use(cors(corsOptions), etag());

// Custom Not Found Message
app.notFound((error) =>	error.json({ error: error.event}, 404));

// Error handling
app.onError((err, c) =>
	c.json({message: err.message, stack: err.stack}, 500),
);

// Simple route
app.get('/', async (c) => await c.html(toHtml(c.req.raw)));
// app.get('/', (c) => c.html(toHtml(c.req)));

//cloudflare request cf status
app.get('/cf', async (c) => await c.json(c.req.raw.cf));
app.get('/cf/', async (c) => await c.html(toHtml(c.req)));

//api route
app.route('/api', data);
app.route('/api/', data);


export default app;
