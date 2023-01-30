/*
URL
  http://localhost:8055/upsert/:collection
Method
  POST
Headers
  Authorization: ...
  Content-Type: application/json
Body
{
    "key": {
        "key": "test2"
    },
    "body": {
      "key": "test2",
      "value": "testindddddg"
    }
}
*/

const resData = {
  success: true,
  msg: 'Success',
  code: 200,
  data: null
}

export default {
	id: 'upsert',
	handler: async (router, { services, database, getSchema, exceptions }) => {
		const { ItemsService } = services;
		const { ServiceUnavailableException, RouteNotFoundException } = exceptions;
		router.get('/', (req, res) => res.send('Hello, World!'));
		router.get('/intro', (req, res) => res.send('Nice to meet you.'));
		router.get('/:collection', (req, res) => res.send(`Nice to meet you. ${req.params.collection}`));
		router.post('/:collection', async (req, res, next) => {
			try {
				const { collection } = req.params;

				if (!collection) {
					return next(new RouteNotFoundException());
				}

				let reqBody = req.body || {}
				console.log(reqBody);
				const { key = {}, body = {} } = reqBody

				//if (!collection) return res.json({...resData, success: false, msg: 'Missing collection name'})
				if (!key || !Object.keys(key).length) return res.json({...resData, success: false, msg: 'Missing key'})

				const service = new ItemsService(collection, { schema: req.schema, accountability: req.accountability })
				const primaryKeyField = service.schema.collections[collection].primary
				const _where = { ...key }
				console.log(_where);
				const exists = await service.knex.select(primaryKeyField).from(collection).where(_where).first()
				console.log(exists);
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
		
		});
	}
};