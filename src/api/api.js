import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { etag } from 'hono/etag';
import { toHtml } from '../utils/toHtml';
import { cache } from 'hono/cache'
import { listDataBase, insertInto, getTable,getIdTable, updateTable,delTable,dropDatabase } from './data';

const api = new Hono();

// Mount Builtin Middleware
api.use(cors(), etag());

// Add X-Response-Time header
api.use('*', async (c , next) => {
  // cache(c, false);
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  c.header('X-Response-Time', `${ms}ms`);
  c.header('X-powered-By', `GhuniNew`);
});

api.use('*',cache({
    cacheName: 'GNEW',
    cacheControl: 'max-age=3600'
  })
)

// api.notFound(async (c) => c.json(`Not Found ${c.res.status}`  , 404));
// api.onError(async (err,c) => c.text(`Internal Server Error 500 ${err}`, 500));

//get database list
api.get('/', async (c) => listDataBase(c));

// insert table by name_db/p
api.post('/:db_name/p', async (c) => insertInto(c));
//get database list
api.get('/:db_name', async (c) => getTable(c));

//get table by id from database
api.get('/:db_name/:id', async (c) => getIdTable(c));

//delete table by id from database
api.delete('/:db_name/:id', async (c) => delTable(c));

//update table by id from database
api.put('/:db_name/:id', async (c) => updateTable(c));

//delete database
api.delete('/:db_name/d', async (c) => dropDatabase(c));

export default api;
