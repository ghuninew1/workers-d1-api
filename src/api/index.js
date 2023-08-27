import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { etag } from 'hono/etag';
// import cache from '../utils/cache';
import { toHtml } from '../utils/toHtml';
import { cache } from 'hono/cache'

const app = new Hono();

// Mount Builtin Middleware
app.use(cors(), etag());

// Add X-Response-Time header
app.use('*', async (c, next) => {
  // cache(c, false);
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  c.header('X-Response-Time', `${ms}ms`);
  c.header('X-powered-By', `GhuniNew`);
});

app.use(cache({
    cacheName: 'GNEW',
    cacheControl: 'max-age=3600'
  })
)

// app.notFound(async (c) => c.json(`Not Found ${c.res.status}`  , 404));
// app.onError(async (err: any,c) => c.text(`Internal Server Error 500 ${err}`, 500));


//cloudflare request cf status
// app.get('/cf', async (c) => await c.json(c.req.raw.cf));
// app.get('/cf/', async (c) => await c.html(toHtml(c.req)));



export default app;
