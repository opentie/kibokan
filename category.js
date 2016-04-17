'use strict';

const assert = require('assert');

const {
  ObjectSchema,
  ArraySchema,
  BooleanSchema,
  StringSchema,
} = require('./lowlevel');

const Schema = require('./schema');
const AttachmentSchema = require('./attachment_schema');

class Category {
  static get serializationFormat() {
    return new ObjectSchema({
      extraProperties: false,
      properties: {
        name: {
          required: true,
          schema: new StringSchema(),
        },
        schemata: {
          required: false,
          schema: new ArraySchema(),
          default: []
        },
        attachmentSchemata: {
          required: false,
          schema: new ArraySchema(),
          default: []
        },
        rootSchemaName: {
          required: true,
          schema: new StringSchema(),
        }
      }
    });
  }

  static deserialize(serializedCategory) {
    const normalizedCategory =
            this.serializationFormat.normalize(serializedCategory);

    const { name, rootSchemaName } = normalizedCategory;

    const schemata = normalizedCategory.schemata.
            map(Schema.deserialize.bind(Schema));

    const attachmentSchemata = normalizedCategory.attachmentSchemata.
            map(AttachmentSchema.deserialize.bind(AttachmentSchema));

    const instance = new this(
      name, rootSchemaName, schemata, attachmentSchemata);

    return instance;
  }

  serialize() {
    // TODO: implement
  }

  constructor(name, rootSchemaName, schemata, attachmentSchemata) {
    this.name = name;
    this.rootSchemaName = rootSchemaName;
    this.schemata = new Map();
    this.attachmentSchemata = new Map();

    for (let schema of schemata) {
      this.schemata.set(schema.name, schema);
    }
    for (let attachmentSchema of attachmentSchemata) {
      this.schemata.set(attachmentSchemata.name, attachmentSchema);
    }

    this.rootSchema = this.schemata.get(this.rootSchemaName);

    Object.freeze(this);
  }

  resolve(schemaName) {
    assert(this.schemata.has(schemaName),
           `no such schema: ${schemaName}`);

    return this.schemata.get(schemaName);
  }
}

module.exports = Category;
