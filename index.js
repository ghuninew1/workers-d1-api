// node_modules/itty-router/index.mjs
var e = ({ base: e2 = "", routes: t = [] } = {}) => ({ __proto__: new Proxy({}, { get: (o2, s2, r, n) => (o3, ...a) => t.push([s2.toUpperCase(), RegExp(`^${(n = (e2 + o3).replace(/\/+(\/|$)/g, "$1")).replace(/(\/?\.?):(\w+)\+/g, "($1(?<$2>*))").replace(/(\/?\.?):(\w+)/g, "($1(?<$2>[^$1/]+?))").replace(/\./g, "\\.").replace(/(\/?)\*/g, "($1.*)?")}/*$`), a, n]) && r }), routes: t, async handle(e3, ...o2) {
  let s2, r, n = new URL(e3.url), a = e3.query = { __proto__: null };
  for (let [e4, t2] of n.searchParams)
    a[e4] = void 0 === a[e4] ? t2 : [a[e4], t2].flat();
  for (let [a2, c2, l2, i2] of t)
    if ((a2 === e3.method || "ALL" === a2) && (r = n.pathname.match(c2))) {
      e3.params = r.groups || {}, e3.route = i2;
      for (let t2 of l2)
        if (void 0 !== (s2 = await t2(e3.proxy || e3, ...o2)))
          return s2;
    }
} });
var o = (e2 = "text/plain; charset=utf-8", t) => (o2, s2) => {
  const { headers: r = {}, ...n } = s2 || {};
  return "Response" === o2?.constructor.name ? o2 : new Response(t ? t(o2) : o2, { headers: { "content-type": e2, ...r }, ...n });
};
var s = o("application/json; charset=utf-8", JSON.stringify);
var c = o("text/plain; charset=utf-8", String);
var l = o("text/html");
var i = o("image/jpeg");
var p = o("image/png");
var d = o("image/webp");

// src/index.ts
var _404 = () => new Response(null, { status: 404 });
var src_default = {
  async fetch(request, env, ctx) {
    if (!env.__router) {
      const router = e();
      router.get("/", async () => {
        return new Response("Hello world!", {
          headers: {
            "content-type": "text/plain;charset=UTF-8"
          }
        });
      });
      router.get("/api", async () => {
        const ps = env.DB.prepare("select * from data order by id desc");
        const data = await ps.all();
        return new Response(JSON.stringify(data.results), {
          headers: {
            "content-type": "application/json;charset=UTF-8"
          }
        });
      });
      router.get("/api/:id", async ({ params }) => {
        const ps = env.DB.prepare(`SELECT * from data WHERE id = ${params.id}`);
        const data = await ps.all();
        console.log(params.id, data);
        return new Response(JSON.stringify(data.results), {
          headers: {
            "content-type": "application/json;charset=UTF-8"
          }
        });
      });
      router.post("/api", async () => {
        const { name, alt, imag } = request.body();
        const results = await env.DB.prepare(`insert into data (name, alt, imag) values (${name}, ${alt}, ${imag}) `).all();
        return new Response(JSON.stringify(results), {
          headers: {
            "content-type": "application/json;charset=UTF-8"
          }
        });
      });
      router.put("/api/:id", async ({ params }) => {
        const { name, alt, imag } = request.body();
        const results = await env.DB.prepare(`update data set name = ${name}, alt = ${alt}, imag = ${imag} where id = ${params.id} `).all();
        return new Response(JSON.stringify(results), {
          headers: {
            "content-type": "application/json;charset=UTF-8"
          }
        });
      });
      router.delete("/api/:id", async ({ params }) => {
        const results = await env.DB.prepare(`delete from data where id = ${params.id} `).all();
        return new Response(JSON.stringify(results), {
          headers: {
            "content-type": "application/json;charset=UTF-8"
          }
        });
      });
      router.all("*", _404);
      env.__router = router;
    }
    return env.__router.handle(request);
  }
};
export {
  src_default as default
};
//# sourceMappingURL=index.js.map
