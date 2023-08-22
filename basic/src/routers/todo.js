import { Hono } from 'hono'

const api = new Hono()

api.get('/', async (c) => {
	const { results } = await c.env.DB.prepare(`select * from sqlite_master where type = 'table';`).all()
	const tasks = results || []
	return c.jsonT(tasks)
})
// insert table by name_db/p
  api.post('/:name_db/p',  async (c) => {
			const { name_db } = c.req.param()
			const { name, alt, imag, post_id }  = await c.req.json()
      const { results } = await c.env.DB.prepare(`INSERT INTO ${name_db} (name, alt, imag, post_id) VALUES (?, ?, ?, ?);`).bind(name, alt, imag, post_id).run()
			const tasks = results || []
			if(tasks) {
				return c.jsonT({
					message: `${name_db} is added`,
				})
			} else {
				return c.jsonT({
					message: `${name_db} is not added`,
				})
			}
		}
	)

	//get database list
  api.get('/:db_name', async (c) => {
		const { db_name } = c.req.param()
    const { results } = await c.env.DB.prepare(`SELECT * FROM ${db_name};`).all()
    const tasks = results || []
    return c.jsonT(tasks)
  })

	//get table by id from database
	api.get('/:db_name/:id', async (c) => {
		const { db_name } = c.req.param()
		const taskId = c.req.param('id')
		const { results } = await c.env.DB.prepare(`SELECT * FROM ${db_name} WHERE id = ?;`).bind(taskId).all()
		const tasks = results || []
		return c.jsonT(tasks)
	})

	//delete table by id from database
  api.delete('/:db_name/:id', async (c) => {
		const { db_name } = c.req.param()
    const taskId = c.req.param('id')
    await c.env.DB.prepare(`DELETE FROM ${db_name} WHERE id = ?;`).bind(taskId).run()
    return c.jsonT({
      message: `${taskId} is deleted`,
    })
  })

	//update table by id from database
  api.put( '/:db_name/:id', async (c) => {
			const { db_name } = c.req.param()
      const taskId = c.req.param('id')
      await c.env.DB.prepare(`UPDATE ${db_name} SET done = ? WHERE id = ?;`)
        .bind(taskId)
        .run()
      return c.jsonT({
        message: `${taskId} is updated`,
      })
    }
  )

	//delete database
	api.delete('/:db_name/d', async (c) => {
		const { db_name } = c.req.param()
		const name = c.req.queries('name')
		if(name === db_name	) {
			await c.env.DB.prepare(`DROP TABLE ${db_name};`).run()
			return c.jsonT({
				message: `${db_name} is deleted`,
			})
		} else {
			return c.jsonT({
				message: `${db_name} is not deleted`,
			})
		}
	})


export default api
