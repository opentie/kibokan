'use strict';

const assert = require('assert');

const NamedObjectMap = require('./named_object_map');

const Schema = require('./schema');
const ReferenceSchema = require('./reference_schema');
const Fields = require('./fields');
const Validators = require('./validators');
const OptionItem = require('./option_item');

class Category {
  constructor(name) {
    this.name = name;
    this.rootSchemaName = null;
    this._schemata = new NamedObjectMap();
    this._referenceSchemata = new NamedObjectMap();
  }

  set schemata(schemata) {
    this._schemata.replaceWith(schemata);
  }

  get schemata() {
    return [...this._schemata.values()];
  }

  set referenceSchemata(schemata) {
    this._referenceSchemata.replaceWith(schemata);
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

  serialize() {
    const {
      name, rootSchemaName,
      schemata, referenceSchemata,
    } = this;

    const serialize = obj => obj.serialize();

    return {
      name, rootSchemaName,
      schemata: schemata.map(serialize),
      referenceSchemata: referenceSchemata.map(serialize),
    };
  }
}

module.exports = Category;
