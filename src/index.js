const resData = {
  success: true,
  msg: 'Success',
  code: 200,
  data: null
}

export default {
    id: 'upsert',
    handler: async (router, { services, database, getSchema }) => {
        const { ItemsService } = services;

        router.post('/:collection', async (req, res, next) => {
            try {
                const { collection } = req.params;

                if (!collection) {
                    throw "Missing collection";
                }

                let reqBody = req.body || {}
                const { filter = {}, body = {} } = reqBody

                if (!filter || !Object.keys(filter).length) {
                    res.status(400)
                    return res.json({...resData, success: false, msg: 'Missing filter', code: 400})
                }

                const service = new ItemsService(collection, { schema: req.schema, accountability: req.accountability })
                const primaryKeyField = service.schema.collections[collection].primary
                const _where = { ...filter }

                const exists = await service.knex.select(primaryKeyField).from(collection).where(_where).first()

                if (exists) {
                    await service.updateOne(exists[primaryKeyField], body);
                    res.json({...resData, msg: 'Update Success'})
                } else {
                    await service.createOne(body)
                    res.json({...resData, msg: 'Create Success', code: 201})
                    res.status(201)
                }
            } catch (error) {
                res.status(error.status)
                return res.json({...resData, success: false, msg: error.code, code: error.status});
            }

        });
    }
};
