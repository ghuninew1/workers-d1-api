import { Hono } from 'hono';
// import { cors } from 'hono/cors';
// import { etag } from 'hono/etag';

const api = new Hono();

api.get('/api', async (request,env) => {
  const { results } = await env.DB.prepare(`select * from sqlite_master where type = 'table';`).all();
  const tasks = results || [];
  return Response.json(tasks);
});

api.get('/api/:db_name', async (request,env) => {
  const { db_name } = request.param();
  const { results } = await env.DB.prepare(`SELECT * FROM ${db_name};`).bind().run();
  const tasks = results || [];
  return Response.json(tasks);
});

api.post('/api/:db_name/p', async (request,env) => {
  const { db_name } = request.param();
  const { name, alt, imag, post_id } = await request.json();
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

api.get('/api/:db_name/:id', async (request,env) => {
  const { db_name } = request.param();
  const taskId = request.param('id');
  const { results } = await env.DB.prepare(`SELECT * FROM ${db_name} WHERE id = ?;`).bind(taskId).run();
  const tasks = results || [];
  return Response.json(tasks);
});

api.put('/api/:db_name/:id', async (request,env) => {
  const { db_name } = request.param();
  const taskId = request.param('id');
  if (taskId){
    await env.DB.prepare(`UPDATE ${db_name} SET done = ? WHERE id = ?;`).bind(taskId).run();
    return Response.json({ message: `${taskId} is updated` });
  } else {
    return Response.json({ message: `id is not updated` });
  }			
});

api.delete('/api/:db_name/:id', async (request,env) => {
  const { db_name } = request.param();
  const taskId = request.param('id');
  if (taskId){
    await env.DB.prepare(`DELETE FROM ${db_name} WHERE id = ?;`).bind(taskId).run();
    return Response.json({ message: `${taskId} is deleted` });
  } else { 
    return Response.json({ message: `id is not deleted` });
  }
});

export default api;
