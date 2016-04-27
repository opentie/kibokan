const MONGODB_URL = 'mongodb://localhost:27017/kibokan_test';

const assert = require('assert');

const { MongoClient, ObjectID } = require('mongodb');

const koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');

const app = koa();
const nsRouter = new Router();

const Category = require('../category');

const Categories = {
  *show() {
    const { category, params } = this;

    this.body = category.serialize();
  },

  *_category(next) {
    const { db, params } = this;

    const serializedCategory = yield db.collection('categories').findOne({
      name: params.category_name
    });

    this.category = new Category();
    this.category.deserialize(serializedCategory);

    yield next;
  },

  Forms: {
  },
  Entities: {
    *show() {
      const { db, category, params } = this;
      const { entity_id } = params;

      const serializedEntity = yield db.collection('entities').findOne({
        _category_name: category.name,
        _id: ObjectID(entity_id),
      });

      this.body = serializedEntity;
    },
    *bulk() {
      const { db, category, params, request } = this;
      const ids = request.body.ids.map(ObjectID);

      const serializedEntities = yield db.collection('entities').find({
        _category_name: category.name,
        _id: { $in: ids },
      }).toArray();

      this.body = serializedEntities;
    }
  }
};

function *ok() {
  this.body = "it's ok";
}

function *injectDB(next) {
  this.db = yield MongoClient.connect(MONGODB_URL);
  yield next;
}

nsRouter.get('/', ok);
nsRouter.use('/namespaces/:namespace', ...(() => {
  const router = new Router();

  router.use('/categories/:category_name', Categories._category);
  router.post('/categories/:category_name/entities/bulk', Categories.Entities.bulk);
  router.get('/categories/:category_name/entities/:entity_id', Categories.Entities.show);

  return [router.routes(), router.allowedMethods()];
})());

app.use(koaBody());
app.use(injectDB);
app.use(nsRouter.routes());
app.listen(8124);
