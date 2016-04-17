/* eslint-env mocha */
/* eslint no-sync: "off" */

'use strict';

const assert = require('power-assert');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const fixturesYaml = fs.readFileSync(path.join(__dirname, './fixtures/context.yml'));
const categoryData = yaml.safeLoad(fixturesYaml);

const Category = require('../category');

describe('Category', () => {
  describe('.deserialize', () => {
    it('should deserialize ./fixtures/context.yml', () => {
      const category = Category.deserialize(categoryData);
      assert(category instanceof Category);
    });
  });

  context('when ./fixtures/context.yml is loaded', () => {
    const category = Category.deserialize(categoryData);

    it('should have a root schema', () => {
      assert(category.rootSchemaName === '企画基本情報');
      assert(category.rootSchema.name === '企画基本情報');
    });

    it('should have schemata', () => {
      assert(category.schemata.get('企画基本情報') !== null);
      assert(category.schemata.get('屋内企画基本情報') !== null);
      assert(category.schemata.get('屋外企画基本情報') !== null);
    });

    describe('RootSchema', () => {
      const rootSchema = category.rootSchema;

      it('should retrieve all attachments', () => {
        assert.deepStrictEqual(
          rootSchema.retrievePossibleAttachmentSchemata(category).
            map((schema) => schema.name),
          [
            '屋内企画基本情報',
            '屋外企画基本情報',
          ]);
      });
    });
  });
});

/*
describe('RootSchema', () => {
  it('should register self with context', () => {
    const context = new Context();
    const rootSchema = context.createRootSchema(definitions[0]);
    assert(context.rootSchema === rootSchema);
  });

  context('when all schemata is loaded', () => {
    const context = new Context();
    const rootSchema = context.createRootSchema(definitions[0]);
    for (let def of definitions.slice(1)) {
      context.createSubSchema(def);
    }

    it('should retrieve all attachments', () => {
      assert.deepStrictEqual(
        rootSchema.retrievePossibleAttachmentSchemata().
          map((schema) => schema.name),
        [
          '屋内企画基本情報',
          '屋外企画基本情報',
        ]);
    });
  });
});

describe('SubSchema', () => {
  context('"屋外企画基本情報"', () => {
    const context = new Context();
    const schema = context.createSubSchema(definitions[2]);

    it('should register self with context', () => {
      assert(context.rootSchema === null);
      assert(context.schemata.get(schema.name) === schema);
    });

    it('should retrieve all possible fields', () => {
      assert.deepStrictEqual(
        schema.retrieveAllPossibleFields().
          map((field) => field.name),
        [
          '希望実施エリア',
          '雙峰祭前夜祭への参加希望',
        ]);
    });
  });
});
*/
