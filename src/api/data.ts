
export const jsonReply = async (json: String, status: any = 200) => {
	return new Response(JSON.stringify(json), {
		headers: {
			'content-type': 'application/json;charset=UTF-8',
			'access-control-allow-origin': '*', // CORS
			'access-control-allow-methods': '*',
			'access-control-allow-headers': '*',
		},
		status,
	});
};

//export app CreateTask for use in worker.ts
export const CreateTask = async (c: any) => {
    const { name_db } = c.req.param();
    const body = await c.request.json();
    const result = await c.env.DB.prepare(`insert into ${name_db} (name, alt, imag, post_id) values (?, ?, ?, ?)`)
        .run(body.name, body.alt, body.imag, body.post_id);

    return (await jsonReply(result));
};

//export app TaskList for use in worker.ts
export const TaskList = async (c:any)=> {
    const { name_db } = c.req.param();
    const result = await c.env.DB.prepare(`select * from ${name_db}`)
        .bind().all();

    return (await jsonReply(result.results));
};

//export app TaskOne by post_id for use in worker.ts
export const TaskOne = async (c:any, )=> {
    const {name_db, post_id } = c.req.param();
    const result = await c.env.DB.prepare(`select * from ${name_db} where post_id = ? ;`)
        .bind(post_id).all();
    return (await jsonReply(result.results));
};

//export app UpdateTake by post_id for use in worker.ts
export const updateTask = async (c:any)=> {
    const { post_id, name_db } = c.req.param();
    const body = await c.request.json();
    const result = await c.env.DB.prepare(`update ${name_db} set name = ?, alt = ?, imag = ?, post_id = ? where post_id = ?`)
        .run(body.name, body.alt, body.imag, body.post_id, post_id);

    return (await jsonReply(result.results));
};

//export app DeleteTask by post_id for use in worker.ts
export const deleteTask = async (c:any)=> {
    const { post_id, name_db } = c.req.param();
    const result = await c.env.DB.prepare(`delete from ${name_db} where post_id = ?`)
        .run(post_id);

    return (await jsonReply(result.results));
};

//export app DeleteAllTask for use in worker.ts
export const deleteAllTask = async (c:any)=> {
    const { name_db } = c.req.param();
    const result = await c.env.DB.prepare(`delete from ${name_db}`)
        .run();

    return (await jsonReply(result));
};

//export app Create new Database for use in worker.ts
export const CreateNewDatabase = async (c:any)=> {
    const { name } = c.req.param();
    const result = await c.env.DB.prepare(`create table name = ? (id integer primary key autoincrement, name text, alt text, imag text, post_id integer)`)
        .run(name);

    return (await jsonReply(result));
};

//export app ListDatabase for use in worker.ts
export const ListDatabase = async (c:any)=> {
    const result = await c.env.DB.prepare(`select * from sqlite_master where type = 'table'`)
        .all();

    return (await jsonReply(result));
};

//export app DeleteDatabase for use in worker.ts
export const DeleteDatabase = async (c:any)=> {
    const { name } = c.req.param();
    const result = await c.env.DB.prepare(`drop table name = ?`)
        .run(name);

    return (await jsonReply(result));
};

//export app fetch request.cf for use in worker.ts
export const getStatus = async (c:any)=> {
    const fetchData = new Request('https://cloudflare.com/cdn-cgi/trace');
    const data = await fetch(fetchData).then((res) => res.text());
    const result = data.split('\n').reduce((acc, curr) => {
        const [key, value] = curr.split('=');
        return { ...acc, [key]: value };
    }
    , {});
    const fetchData2 = new Request('https://request.cf');
    const data2 = await fetch(fetchData2).then((res) => res.text());
    const result2 = data2.split('\r\n').reduce((acc, curr) => {
        const [key, value] = curr.split('=');
        return { ...acc, [key]: value };
    }, {});
    
    return await jsonReply({
        trace: result,
        request: result2
    });
};