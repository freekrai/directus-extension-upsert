/*
URL
  http://localhost:8058/collection/upsert
Method
  POST
Headers
  Authorization: ...
  Content-Type: application/json
Body
  {
    "collection": "pypsacalc",
    "key": {
      "name": "2",
      "calcType": "TypeA"
    },
    "body": {
      "name": "2",
      "calcType": "TypeA",
      "result": "{\"a\":1,\"b\":3}"
    }
*/

const resData = {
  success: true,
  msg: 'Success',
  code: 200,
  data: null
}

export default (router, { database, services, exceptions }) => {
	const { ItemsService } = services;
	const { ServiceUnavailableException } = exceptions;
	router.post('/upsert', async (req, res, next) => {
		try {
			let reqBody = req.body || {}
			const { collection = '', key = {}, body = {} } = reqBody
			
			if (!collection) return res.json({...resData, success: false, msg: 'Missing collection name'})
			if (!key || !Object.keys(key).length) return res.json({...resData, success: false, msg: 'Missing key'})

			const service = new ItemsService(collection, { schema: req.schema, accountability: req.accountability })
			const primaryKeyField = service.schema.collections[collection].primary
			const _where = { ...key }

			const exists = await service.knex.select(primaryKeyField).from(collection).where(_where).first()

			if (exists) {
				await service.updateOne(exists[primaryKeyField], body);
				res.json({...resData, msg: 'Update Success'})
			} else {
				await service.createOne(body)
				res.json({...resData, msg: 'Create Success', code: 201})
			}
		} catch (error) {
			return next(new ServiceUnavailableException(error.message));
		}
	})
}