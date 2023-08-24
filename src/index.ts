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
					return await api.fetch(request, env, ctx);
				case "/ws/":
					return await template();
				case "/ws":
					return await websocketHandler(request);
				default:
					return await api.fetch(request, env, ctx);
			}
		} catch (err: any) {
			return new Response(err.stack || err);
		}
	},
};
