import { Hono } from 'hono';



const listDataBase= async (c) => {
	const { results } = await c.env.DB.prepare(`select * from sqlite_master where type = 'table';`).all();
	const tasks = results || [];
	return c.json(tasks);
};

// insert table by name_db/p
const insertInto = async (c) => {
	const db_name  = c.req.param('db_name');
	const { name, alt, imag, post_id } = await c.req.json();
	const { results } = await c.env.DB.prepare(`INSERT INTO ${db_name} (name, alt, imag, post_id) VALUES (?, ?, ?, ?);`)
		.bind(name, alt, imag, post_id)
		.run();
	const tasks = results || [];
	if (tasks) {
		return c.json({
			message: `${db_name} is added`,
		});
	} else {
		return c.json({
			message: `${db_name} is not added`,
		});
	}
};

//get table by id from database
const getTable = async (c) => {
	const db_name = c.req.param('db_name');
	const { results } = await c.env.DB.prepare(`SELECT * FROM ${db_name};`).all();
	const tasks = results || [];
	return c.json(tasks);
};

//get table by id from database
const getIdTable = async (c) => {
	const { db_name } = c.req.param();
	const taskId = c.req.param('id');
	const { results } = await c.env.DB.prepare(`SELECT * FROM ${db_name} WHERE id = ?;`).bind(taskId).run();
	const tasks = results || [];
	return c.jsonT(tasks);
};

//delete table by id from database
const delTable = async (c) => {
	const { db_name } = c.req.param();
	const taskId = c.req.param('id');
	await c.env.DB.prepare(`DELETE FROM ${db_name} WHERE id = ?;`).bind(taskId).run();
	return c.json({
		message: `${taskId} is deleted`,
	});
};

//update table by id from database
const updateTable = async (c) => {
	const { db_name } = c.req.param();
	const taskId = c.req.param('id');
	await c.env.DB.prepare(`UPDATE ${db_name} SET done = ? WHERE id = ?;`).bind(taskId).run();
	return c.json({message: `${taskId} is updated`});
};

//delete database
const dropDatabase = async (c) => {
	const { db_name } = c.req.param();
	const name = c.req.queries('name');
	if (name === db_name) {
		await c.env.DB.prepare(`DROP TABLE ${db_name};`).run();
		return c.json({ message: `${db_name} is deleted`});
	} else {
		return c.json({ message: `${db_name} is not deleted`});
	}
};
export { listDataBase, insertInto, getTable, getIdTable, delTable, updateTable, dropDatabase };
