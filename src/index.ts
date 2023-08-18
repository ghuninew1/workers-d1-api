import { Hono } from 'hono';
import { cors } from 'hono/cors';

interface Comment {
	author: string;
	body: string;
}
const app = new Hono();
app.use('/api/*', cors());

app.get('/', async (c) => {
	const response = await c.env.DB.prepare(
		`SELECT name from sqlite_schema where type = ? and name NOT LIKE ?;`
	)
		.bind('table', 'sqlite_%')
		.all();



	const tables: Array<{ name: string }> = response.results
		? response.results
		: response.result[0];


	return c.json({
					tables: Object.fromEntries(
						tables.map(({ name }) => [
							name,
							{
								count: new URL(`/${name}`, c.req.url),
							},
						])
					),
				});
	
});
app.get('/:name', async c => {
	const { name } = c.req.param();
	const response = await c.env.DB.prepare(`SELECT count(*) from [${name}];`).all();
	return c.json(response);
});

app.get('/api/data', async c => {
	const { results } = await c.env.DB.prepare(
		`SELECT * from data;`
	)
		.bind()
		.all();
	return c.json(results);
});

app.get('/api/data/:slug/data', async c => {
	const { slug } = c.req.param();
	const { results } = await c.env.DB.prepare(
		`SELECT * from data where post_id = ?; `
	)
		.bind(slug)
		.all();
	return c.json(results);
});

app.post('/api/data', async c => {
	const { name, alt, imag, post_id } = await c.req.json<{ name: string; alt: string; imag: string; post_id: string }>();

	if (!name) return c.text('Missing name value for new data');
	if (!alt) return c.text('Missing alt value for new data');
	if (!imag) return c.text('Missing imag value for new data');
	if (!post_id) return c.text('Missing post_id value for new data');

	const { success } = await c.env.DB.prepare(
		`insert into data (name, alt, imag, post_id) values (?, ?, ?, ?); `
	)
		.bind(name, alt, imag, post_id)
		.run();

	if (success) {
		c.status(201);
		return c.text('Created');
	} else {
		c.status(500);
		return c.text('Something went wrong');
	}
});

app.put('/api/data/:name', async c => {
	const { name } = c.req.param();
	const { alt, imag } = await c.req.json<{ alt: string; imag: string }>();

	if (!alt) return c.text('Missing alt value for new data');
	if (!imag) return c.text('Missing imag value for new data');

	const { success } = await c.env.DB.prepare(
		`update data set alt = ?, imag = ? where post_id = ?;`
	)
		.bind(alt, imag, name)
		.run();

	if (success) {
		c.status(200);
		return c.text('Updated');

	} else {
		c.status(500);
		return c.text('Something went wrong');
	}
});

app.delete('/api/data/:name', async c => {
	const { name } = c.req.param();

	const { success } = await c.env.DB.prepare(
		`delete from data where post_id = ?;`
	)
		.bind(name)
		.run();

	if (success) {
		c.status(200);
		return c.text('Deleted');
	} else {
		c.status(500);
		return c.text('Something went wrong');
	}
});

app.get('/api/posts', async c => {
	const results = await c.env.DB.prepare(
		`SELECT * from comments;`
	)
		.bind()
		.all();
		return c.json(results);
});

app.get('/api/posts/:slug/comments', async c => {
	const { slug } = c.req.param();
	const { results } = await c.env.DB.prepare(
		`SELECT * from comments where post_slug = ?; `
	)
		.bind(slug)
		.all();
	return c.json(results);
});

app.post('/api/posts/:slug/comments', async c => {
	const { slug } = c.req.param();
	const { author, body } = await c.req.json<Comment>();

	if (!author) return c.text('Missing author value for new comment');
	if (!body) return c.text('Missing body value for new comment');

	const { success } = await c.env.DB.prepare(
		`insert into comments (author, body, post_slug) values (?, ?, ?); `
	)
		.bind(author, body, slug)
		.run();

	if (success) {
		c.status(201);
		return c.text('Created');
	} else {
		c.status(500);
		return c.text('Something went wrong');
	}
});


app.put('/api/posts/:slug/comments', async c => {
	const { slug } = c.req.param();
	const { author, body } = await c.req.json<Comment>();

	if (!author) return c.text('Missing author value for new comment');
	if (!body) return c.text('Missing body value for new comment');

	const { success } = await c.env.DB.prepare(
		`update comments set author = ?, body = ? and post_slug = ?;`
	)
		.bind(author, body,  slug)
		.run();

	if (success) {
		c.status(200);
		return c.text('Updated');

	} else {
		c.status(500);
		return c.text('Something went wrong');
	}
});


app.onError((err, c) => {
	console.error(`${err}`);
	return c.text(err.toString());
});

app.notFound(c => c.text('Not found', 404));

export default app;