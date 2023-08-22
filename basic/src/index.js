import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { etag } from 'hono/etag'
import { logger } from 'hono/logger';
import corsOptions from './utils/cors.js';
import api from './routers/todo.js';
import cache from './utils/cache.js';
import { convertTohtml } from './utils/toHtml.js';

const app = new Hono()

// Add X-Response-Time header
app.use('*', async (c, next) => {
	cache(c, true)
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  c.header('X-Response-Time', `${ms}ms`)
  c.header('X-powered-By', `GhuniNew`)
	c.header('Accept-Encoding', 'gzip, deflate, br')
})

// Mount Builtin Middleware
app.use(logger(), cors(corsOptions), etag());

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

// Simple route
app.get('/', (c) => c.redirect('/cf'))

//cloudflare request cf status
app.get('/cf', (c) => {
	const cf = c.req.raw.cf;
	return c.jsonT(cf)
})

//api route
app.route('/api', api)
app.route('/api/', api)

export default app
