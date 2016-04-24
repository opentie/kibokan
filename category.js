'use strict';

const assert = require('assert');

const Serializable = require('./serializable');

const NamedObjectMap = require('./named_object_map');

const Schema = require('./schema');
const ReferenceSchema = require('./reference_schema');
const Fields = require('./fields');
const Validators = require('./validators');
const OptionItem = require('./option_item');
// DIRTY HACK: resolve circular reference
OptionItem.property('insertionFields', [], [Fields]);

class Category extends Serializable {
  constructor(initialValues) {
    super(null, initialValues);
  }

  set schemata(schemata) {
    this._schemata = NamedObjectMap.fromArray(schemata);
  }

  get schemata() {
    return [...this._schemata.values()];
  }

  set referenceSchemata(schemata) {
    this._referenceSchemata = NamedObjectMap.fromArray(schemata);
  }

  get referenceSchemata() {
    return [...this._referenceSchemata.values()];
  }

  get rootSchema() {
    return this.resolve(this.rootSchemaName);
  }

  resolve(schemaName) {
    assert(this._schemata.has(schemaName),
           `no such schema: ${schemaName}`);

    return this._schemata.get(schemaName);
  }

  createSchema(...args) {
    return new Schema(this, ...args);
  }

  createReferenceSchema(...args) {
    return new ReferenceSchema(this, ...args);
  }

  createField(className, ...args) {
    const Field = Fields.get(className);

    return new Field(this, ...args);
  }

  createValidator(className, ...args) {
    const Validator = Validators.get(className);

    return new Validator(this, ...args);
  }

  createOptionItem(...args) {
    return new OptionItem(this, ...args);
  }
}
Category.property('name', null);
Category.property('rootSchemaName', null);
Category.property('schemata', [], [Schema]);
Category.property('referenceSchemata', [], [ReferenceSchema]);

module.exports = Category;
