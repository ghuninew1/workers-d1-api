import { Env } from "./types";

import api from "./api/data";
import websocketHandler from "./api/ws";
import template from "./api/template";


export default {

	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		try {
			const url = new URL(request.url);
			switch (url.pathname) {
				case "/":
					return template();
				case "/ws":
					return await websocketHandler(request);
				case "/api":
					return api.fetch(request, env, ctx);
				default:
					return api.fetch(request, env, ctx);
			}
		} catch (err: unknown) {
			const e = err as Error;
			return new Response(e.toString());
		}
	},
}


