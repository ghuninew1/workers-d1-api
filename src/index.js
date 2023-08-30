import websocketHandler from './api/ws';
import template from './api/template';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { etag } from 'hono/etag';
import { htmltmp } from './utils/htmltmp';

export default {
	async fetch(request, env, ctx) {
		// if (!env.__router) {
		const router = new Hono();
		const starttime = Date.now();
		// Mount Builtin Middleware
		router.use(cors({ 
			origin: '*',
			allowHeaders: '*',
			allowMethods: '*',
		}), etag());
		router.get('/api/*',cors({ 
			origin: '*',
			allowHeaders: '*',
			allowMethods: '*',
		}));
		router.get('/api',cors({ 
			origin: '*',
			allowHeaders: '*',
			allowMethods: '*',
		}));

		router.use(async (c, next) => {
			const start = Date.now();
			await next();
			const ms = Date.now() - start;
			c.header('X-Response-Time', `${ms} ms`);
			c.header('X-powered-By', `GhuniNew`);
			c.header('Cache-Control', 'max-age=3600, immutable');
		});

		router.get('/',  async(c) => await c.html(htmltmp(request, starttime)));
		router.get('/ws', async () => await template(request, starttime));
		router.get('/ws/', async() => await websocketHandler(request));
		//
		router.get('/api/', async(c) => await c.redirect('/api'));

		router.get('/api', async (c) => {
			const { results } = await env.DB.prepare(`select * from sqlite_master where type = 'table';`).all();
			const tasks = results || [];
			return c.json(tasks);
		});

		router.get('/api/:db_name', async (c) => {
			const { db_name } = c.req.param();
			const { results } = await env.DB.prepare(`SELECT * FROM ${db_name};`).bind().run();
			const tasks = results || [];
			return c.json(tasks);
		});
		router.get('/api/:db_name/', (c) => {
			const { db_name } = c.req.param();
			return c.redirect(`/api/${db_name}`);
		});

		router.post('/api/:db_name/p', async (c) => {
			const { db_name } = c.req.param();
			const { name, alt, imag, post_id } = await c.req.json();
			const { results } = await env.DB.prepare(`INSERT INTO ${db_name} (name, alt, imag, post_id) VALUES (?, ?, ?, ?);`)
				.bind(name, alt, imag, post_id)
				.run();
			const tasks = results || [];
			if (tasks) {
				return c.json({ message: `${db_name} is added` });
			} else {
				return c.json({ message: `${db_name} is not added` });
			}
		});

		router.get('/api/:db_name/:id', async (c) => {
			const { db_name } = c.req.param();
			const taskId = c.req.param('id');
			const { results } = await env.DB.prepare(`SELECT * FROM ${db_name} WHERE id = ?;`).bind(taskId).run();
			const tasks = results || [];
			return c.json(tasks);
		});
		router.get('/api/:db_name/:id/', (c) => {
			const { db_name } = c.req.param();
			const taskId = c.req.param('id');
			return c.redirect(`/api/${db_name}/${taskId}`);
		});

		router.put('/api/:db_name/:id', async (c) => {
			const { db_name } = c.req.param();
			const taskId = c.req.param('id');
			if (taskId) {
				await env.DB.prepare(`UPDATE ${db_name} SET done = ? WHERE id = ?;`).bind(taskId).run();
				return c.json({ message: `${taskId} is updated` });
			} else {
				return c.json({ message: `id is not updated` });
			}
		});

		router.delete('/api/:db_name/:id', async (c) => {
			const { db_name } = c.req.param();
			const taskId = c.req.param('id');
			if (taskId) {
				await env.DB.prepare(`DELETE FROM ${db_name} WHERE id = ?;`).bind(taskId).run();
				return c.json({ message: `${taskId} is deleted` });
			} else {
				return c.json({ message: `id is not deleted` });
			}
		});

		router.onError((err, c) => c.text(err.message, 500));
		router.notFound((c) => c.text('Not found', 404));

		env.__router = router;
		return env.__router.fetch(request);
	},
};
