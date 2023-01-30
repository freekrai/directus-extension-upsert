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

		router.post('/:collection', async (req, res, next) => {
			try {
				const { collection } = req.params;

				if (!collection) {
					return next(new RouteNotFoundException());
				}

				let reqBody = req.body || {}
				console.log(reqBody);
				const { key = {}, body = {} } = reqBody

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