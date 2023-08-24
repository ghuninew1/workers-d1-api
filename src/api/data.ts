import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { etag } from 'hono/etag';
// import cache from '../utils/cache';
import { toHtml } from '../utils/toHtml';
import { cache } from 'hono/cache'

export interface Env {
	DB: D1Database;
}
export interface Data {
	id: number;
	name: string;
	alt: string;
	imag: string;
	post_id: number;
	update_at: string;
}
const app = new Hono();

// Mount Builtin Middleware
app.use(cors(), etag());

// Add X-Response-Time header
app.use('*', async (c: any, next) => {
	// cache(c, false);
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	c.header('X-Response-Time', `${ms}ms`);
	c.header('X-powered-By', `GhuniNew`);
});

app.get('*',cache({
	  cacheName: 'GNEW',
	  cacheControl: 'max-age=3600',
	})
  )

app.notFound(async (c: any) => c.json(`Not Found ${c.res.status}`  , 404));
app.onError(async (err: any,c) => c.text(`Internal Server Error 500 ${err}`, 500));

app.get('/', async (c: any) => await c.html(toHtml(c.req)));

//cloudflare request cf status
app.get('/cf', async (c: any) => await c.json(c.req.raw.cf));
app.get('/cf/', async (c: any) => await c.html(toHtml(c.req)));

//
const api = new Hono();

api.get('/', async (c:any) => {
	const { results } = await c.env.DB.prepare(`select * from sqlite_master where type = 'table';`).all();
	const tasks = results || [];
	return c.json(tasks);
});

// insert table by name_db/p
api.post('/:db_name/p', async (c:any) => {
	const { db_name } = c.req.param();
	const { name, alt, imag, post_id } = await c.req.json();
	const { results } = await c.env.DB.prepare(`INSERT INTO ${db_name} (name, alt, imag, post_id) VALUES (?, ?, ?, ?);`)
		.bind(name, alt, imag, post_id)
		.run();
	const tasks = results || [];
	if (tasks) {
		return c.json({
			message: `${db_name} is added`,
		});
	} else {
		return c.json({
			message: `${db_name} is not added`,
		});
	}
});

//get database list
api.get('/:db_name', async (c:any) => {
	const { db_name } = c.req.param();
	const { results } = await c.env.DB.prepare(`SELECT * FROM ${db_name};`).all();
	const tasks = results || [];
	return c.json(tasks);
});

//get table by id from database
api.get('/:db_name/:id', async (c:any) => {
	const { db_name } = c.req.param();
	const taskId = c.req.param('id');
	const { results } = await c.env.DB.prepare(`SELECT * FROM ${db_name} WHERE id = ?;`).bind(taskId).all();
	const tasks = results || [];
	return c.jsonT(tasks);
});

//delete table by id from database
api.delete('/:db_name/:id', async (c:any) => {
	const { db_name } = c.req.param();
	const taskId = c.req.param('id');
	await c.env.DB.prepare(`DELETE FROM ${db_name} WHERE id = ?;`).bind(taskId).run();
	return c.json({
		message: `${taskId} is deleted`,
	});
});

//update table by id from database
api.put('/:db_name/:id', async (c:any) => {
	const { db_name } = c.req.param();
	const taskId = c.req.param('id');
	await c.env.DB.prepare(`UPDATE ${db_name} SET done = ? WHERE id = ?;`).bind(taskId).run();
	return c.json({
		message: `${taskId} is updated`,
	});
});

//delete database
api.delete('/:db_name/d', async (c:any) => {
	const { db_name } = c.req.param();
	const name = c.req.queries('name');
	if (name === db_name) {
		await c.env.DB.prepare(`DROP TABLE ${db_name};`).run();
		return c.json({
			message: `${db_name} is deleted`,
		});
	} else {
		return c.json({
			message: `${db_name} is not deleted`,
		});
	}
});

app.route('/api', api);
app.route('/api/', api);

export default app;
