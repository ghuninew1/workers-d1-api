import { Hono } from 'hono';

export default  router => {
	let tables=[]
	router.get('/c', async (c) => {
	const response = c.env.DB.prepare(`SELECT name from sqlite_schema where type = ? and name NOT LIKE ?;`)
	.bind('table', 'sqlite_%')
	.all();
	tables = response.results ? response.results : response.result[0];
		return c.json({
			tables: Object.fromEntries(
				tables.map(({ name }) => [
					name,
					{
						count: new URL(`/api/${name}`, request.url),
					},
				])
			),
			url: new URL(`/`, request.url),
			ws: new URL(`/ws`, request.url),
			t_res: Date.now() - starttime + 'ms',
			ip_cf: c.req.headers.get('cf-connecting-ip'),
		});
	});
	tables.forEach((c,{ name }) => {
		router.get('/count/' + encodeURIComponent(name), async () => {
			// TODO: .first() doesn't yet work on Miniflare due to implicit .bulk
			const response = await c.env.DB.prepare(`SELECT count(*) from [${name}];`).all();
			return c.json(response.results ? response.results : response.result[0]);
		});
	})

}
