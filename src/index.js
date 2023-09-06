import websocketHandler from "./ws";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import ping from "./ping";
import template from "./template.html";
import { htmltmp } from "./htmltmp";

export default {
  async fetch(request, env) {
    const app = new Hono();

    // Mount Builtin Middlewar
    app.use(etag()), cors({ origin: "*" });

    app.use("*", async (c, next) => {
      const timeStart = Date.now();
      await next();
      c.res.headers.set("X-Response-Time", `${Date.now() - timeStart} ms`);
      c.res.headers.set("Access-Allow-Origin", "*");
      c.res.headers.set("X-powered-By", `GhuniNew`);
    });

    app.get("/", async (c) => c.html(htmltmp(request)));

    app.get("/ws", async (c) => c.html(template));

    app.get("/ws/", async () => await websocketHandler(request, env));

    app.get("/ping", async () => await ping.fetch(request));

    app.get("/ip/:ip", async (c) => {
      const { ip } = c.req.param();
      const ipinfo = `https://ipinfo.io/${ip}?token=f44742fe54a2b2`;
      const res = await fetch(ipinfo);
      return c.json(await res.json());
    });

    app.get("/who", async (c) => {
      const ipinfo = `https://ipinfo.io/?token=f44742fe54a2b2`;
      const res = await fetch(ipinfo);
      return c.json(await res.json());
    });

    app.get("/api/", async (c) => await c.redirect("/api"));

    app.get("/api", async (c) => {
      const { results } = await env.DB.prepare(`select * from sqlite_master where type = 'table';`).all();
      const tasks = results || [];
      return c.json(tasks);
    });

    app.get("/api/:db_name", async (c) => {
      const { db_name } = c.req.param();
      const { results } = await env.DB.prepare(`SELECT * FROM ${db_name};`).bind().run();
      const tasks = results || [];
      return c.json(tasks);
    });

    app.get("/api/:db_name/", (c) => {
      const { db_name } = c.req.param();
      return c.redirect(`/api/${db_name}`);
    });

    app.post("/api/:db_name/p", async (c) => {
      const { db_name } = c.req.param();
      const { name, alt, imag, post_id } = await c.req.json();
      const { results } = await env.DB.prepare(`INSERT INTO ${db_name} (name, alt, imag, post_id) VALUES (?, ?, ?, ?);`)
        .bind(name, alt, imag, post_id).run();
      const tasks = results || [];
        return c.json({ message: `${db_name} is added ${tasks}` });
    });

    app.get("/api/:db_name/:id", async (c) => {
      const { db_name } = c.req.param();
      const taskId = c.req.param("id");
      const { results } = await env.DB.prepare(`SELECT * FROM ${db_name} WHERE id = ?;`).bind(taskId).run();
      const tasks = results || [];
      return c.json(tasks);
    });
    
    app.get("/api/:db_name/:id/", (c) => {
      const { db_name } = c.req.param();
      const taskId = c.req.param("id");
      return c.redirect(`/api/${db_name}/${taskId}`);
    });

    app.put("/api/:db_name/:id", async (c) => {
      const { db_name } = c.req.param();
      const taskId = c.req.param("id");
      const { name, alt, imag, post_id } = await c.req.json();
      if (taskId) {
        await env.DB.prepare(`UPDATE ${db_name} SET name = ?, alt = ?, imag = ?, post_id = ? WHERE id = ?;`)
          .bind(name, alt, imag, post_id, taskId).run();
        return c.json({ message: `${taskId} is updated` });
      } else {
        return c.json({ message: `id is not updated` });
      }
    });

    app.delete("/api/:db_name/:id", async (c) => {
      const { db_name } = c.req.param();
      const taskId = c.req.param("id");
      if (taskId) {
        await env.DB.prepare(`DELETE FROM ${db_name} WHERE id = ?;`).bind(taskId).run();
        return c.json({ message: `${taskId} is deleted` });
      } else {
        return c.json({ message: `id is not deleted` });
      }
    });

    app.onError((err, c) => c.text(err.message, 500));
    app.notFound((c) => c.json("Not Found", 404));

    env.__app = app;

    return env.__app.fetch(request);
  },
};
