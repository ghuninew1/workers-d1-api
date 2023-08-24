export interface Data {
	id: number;
	name: string;
	alt: string;
	imag: string;
	post_id: number;
	update_at: string;
}

//export app init for use in worker.ts
export const init = async (c: any) => {
	interface Name_db {
		id: number;
		name: string;
		alt: string;
		imag: string;
		post_id: number;
		update_at: string;
	}
	const { name_db } = c.req.param();
	const { success } = await c.env.DB.prepare(
		`create table if not exists ${name_db} (id integer primary key autoincrement, name text not null, alt text not null, imag text not null,post_id text not null,update_at text not null default (strftime('%Y-%m-%d %H:%M:%f', 'now', 'localtime')));
			CREATE INDEX IF NOT EXISTS idx_${name_db}_post_id ON ${name_db}(post_id);`
	)
		.bind()
		.run();

	if (success) {
		return c.text(`Table ${name_db} created successfully`);
	} else {
		return c.text(`Table ${name_db} already exists`);
	}
};

//export app CreateTask for use in worker.ts
export const CreateTask = async (c: any) => {
	const { name_db } = c.req.param();
	const { name, alt, imag, post_id } = await c.req.json();

	if (!name) return c.text('Missing Name value');
	if (!alt) return c.text('Missing alt value');
	if (!imag) return c.text('Missing imag value');

	const { success } = await c.env.DB.prepare(`insert into ${name_db} (name, alt, imag, post_id) values (?, ?, ?, ?);`)
		.bind(name, alt, imag, post_id)
		.run();

	if (success) {
		c.status(201);
		return c.text(`insert Cpomplete ${name_db} successfully ${name}, ${alt}, ${imag}, ${post_id}`);
	} else {
		c.status(500);
		return c.text(`Something went wrong${c.req}`);
	}
};

//export app TaskList for use in worker.ts
export const TaskList = async (c: any) => {
	const { name_db } = c.req.param();
	const { results } = await c.env.DB.prepare(`select * from ${name_db};`).bind().run();

	return await c.jsonT(results);
};

//export app TaskOne by post_id for use in worker.ts
export const TaskOne = async (c: any) => {
	const { name_db, post_id } = c.req.param();
	const { results } = await c.env.DB.prepare(`select * from ${name_db} where id = ?;`).bind(post_id).run();
	return await c.jsonT(results);
};

//export app UpdateTake by post_id for use in worker.ts
export const updateTask = async (c: any) => {
	const { id, name_db } = c.req.param();
	const { name, alt, imag, post_id } = await c.req.json();

	if (!name) return c.text('Missing Name value ');
	if (!alt) return c.text('Missing alt value ');
	if (!imag) return c.text('Missing imag value ');

	const { success } = await c.env.DB.prepare(`update ${name_db} set name = ?, alt = ?, imag = ?, post_id = ? where id = ?;`)
		.bind(name, alt, imag, post_id, id)
		.run();

	if (success) {
		c.status(201);
		return c.text(`Updated ${name_db} successfully`);
	} else {
		c.status(500);
		return c.text(`Something ${name_db} went wrong ${c.req}`);
	}
};

//export app DeleteTask by post_id for use in worker.ts
export const deleteTask = async (c: any) => {
	const { post_id, name_db } = c.req.param();
	const { success } = await c.env.DB.prepare(`delete from ${name_db} where id = ?;`).bind(post_id).run();

	if (success) {
		return c.text(`Deleted ${name_db} successfully`);
	} else {
		return c.text(`Something ${name_db} went wrong ${c.req}`);
	}
};

//export app ListDatabase for use in worker.ts
export const ListDatabase = async (c: any) => {
	const { results } = await c.env.DB.prepare(`select * from sqlite_master where type = 'table';`).all();

	return await c.jsonT(results);
};

//export app DeleteDatabase for use in worker.ts
export const DeleteDatabase = async (c: any) => {
	const { name } = c.req.param();
	const { success } = await c.env.DB.prepare(`drop table if exists ${name};`).bind().run();

	if (success) {
		return c.text(`Deleted ${name} successfully`);
	} else {
		return c.text(`Something ${name} went wrong ${c.req}`);
	}
};
