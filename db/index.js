const MONGODB_URL = 'mongodb://localhost:27017/kibokan_test';

const assert = require('assert');

const { MongoClient } = require('mongodb');

const koa = require('koa');
const Router = require('koa-router');

const app = koa();
const router = new Router();

const { Category } = require('../');

const Categories = {
  *show() {
    const { category, params } = this;

    this.body = category.serialize();
  },

  RootSchema: {
    *show(next) {
      const { category, params } = this;

      this.body = category.rootSchema;
    }
  }
};

router.get('/categories/:category_name/root_schema', Categories.RootSchema.show);

router.use('/categories/:category_name', function *(next) {
  const { db, params } = this;

  const serializedCategory = yield db.collection('categories').findOne({
    name: params.category_name
  });

  this.category = Category.deserialize(serializedCategory);

  yield next;
});

app.use(function *(next) {
  this.db = yield MongoClient.connect(MONGODB_URL);
  yield next;
});
app.use(router.routes());
app.listen(8124);
