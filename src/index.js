import { websocketHandler } from './api/ws';
import template from './api/template';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { etag } from 'hono/etag';

// let router = Router();
export default {
	async fetch(request, env, ctx) {
		// if (!env.__router) {
		const router = new Hono();
		const starttime = Date.now();

		// Mount Builtin Middleware
		router.use(cors(), etag());

		// Add X-Response-Time header
		router.use(async (c, next) => {
			const start = Date.now();
			await next();
			const ms = Date.now() - start;
			c.header('X-Response-Time', `${ms}ms`);
			c.header('X-powered-By', `GhuniNew`);
			c.header('Expires', new Date(Date.now() + 3600 * 1000).toLocaleString());
			c.header('Cache-Control', 'max-age=3600, immutable' );
		});

		// Figure out what tables we have in the DB
		const response = await env.DB.prepare(`SELECT name from sqlite_schema where type = ? and name NOT LIKE ?;`)
			.bind('table', 'sqlite_%')
			.all();

		/* TODO: Fix once Miniflare is updated (it currently returns everything as .bulk) */
		const tables = response.results ? response.results : response.result[0];

		// Return an index
		router.get('/', async () => {
			return Response.json({
				tables: Object.fromEntries(
					tables.map(({ name }) => [
						name,
						{
							count: new URL(`/api/${name}`, request.url),
						},
					])
				),
				ws: new URL(`/ws`, request.url),
				t_res: Date.now() - starttime + 'ms', 
				ip_cf: request.headers.get('cf-connecting-ip'),
				cf: request.cf,
			});
			
		});
		// Add a route for each table
		tables.forEach(({ name }) => {
			router.get('/count/' + encodeURIComponent(name), async () => {
				// TODO: .first() doesn't yet work on Miniflare due to implicit .bulk
				const response = await env.DB.prepare(`SELECT count(*) from [${name}];`).all();
				return Response.json(response);
			});
		});

		router.get('/ws', () => template())
		router.get('/ws/', () => websocketHandler(request))
		//
		router.get('/api', async () => {
			const { results } = await env.DB.prepare(`select * from sqlite_master where type = 'table';`).all();
			const tasks = results || [];
			return Response.json(tasks);
		});

		router.get('/api/:db_name', async (c) => {
			const { db_name } = c.req.param();
			const { results } = await env.DB.prepare(`SELECT * FROM ${db_name};`).bind().run();
			const tasks = results || [];
			return Response.json(tasks);
		});

		router.post('/api/:db_name/p', async (c) => {
			const { db_name } = c.req.param();
			const { name, alt, imag, post_id } = await c.req.json();
			const { results } = await env.DB.prepare(`INSERT INTO ${db_name} (name, alt, imag, post_id) VALUES (?, ?, ?, ?);`)
				.bind(name, alt, imag, post_id)
				.run();
			const tasks = results || [];
			if (tasks) {
				return Response.json({ message: `${db_name} is added` });
			} else { 
				return Response.json({ message: `${db_name} is not added` });
			}
		});

		router.get('/api/:db_name/:id', async (c) => {
			const { db_name } = c.req.param();
			const taskId = c.req.param('id');
			const { results } = await env.DB.prepare(`SELECT * FROM ${db_name} WHERE id = ?;`).bind(taskId).run();
			const tasks = results || [];
			return Response.json(tasks);
		});

		router.put('/api/:db_name/:id', async (c) => {
			const { db_name } = c.req.param();
			const taskId = c.req.param('id');
			if (taskId){
				await env.DB.prepare(`UPDATE ${db_name} SET done = ? WHERE id = ?;`).bind(taskId).run();
				return Response.json({ message: `${taskId} is updated` });
			} else {
				return Response.json({ message: `id is not updated` });
			}			
		});

		router.delete('/api/:db_name/:id', async (c) => {
			const { db_name } = c.req.param();
			const taskId = c.req.param('id');
			if (taskId){
				await env.DB.prepare(`DELETE FROM ${db_name} WHERE id = ?;`).bind(taskId).run();
				return Response.json({ message: `${taskId} is deleted` });
			} else { 
				return Response.json({ message: `id is not deleted` });
			}
		});

		env.__router = router;

		return env.__router.fetch(request);
	},
};
