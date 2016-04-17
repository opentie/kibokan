'use strict';

const assert = require('assert');

const {
  ObjectSchema,
  ArraySchema,
  StringSchema,
  NullableSchema,
} = require('./lowlevel');

const Field = require('./field');

const staticize = require('./staticize').bind(null, 'serializationFormat');

class Schema {
  static get serializationFormat() {
    return new ObjectSchema({
      extraProperties: false,
      properties: {
        name: {
          schema: new StringSchema()
        },
        fields: {
          schema: new ArraySchema()
        },
        deadline: {
          required: false,
          default: null,
          schema: new NullableSchema({
            schema: new StringSchema()
          })
        },
      }
    });
  }

  constructor(name, fields, deadline) {
    this.name = name;
    this.fields = new Map();
    this.deadline = deadline;

    for (let field of fields) {
      this.fields.set(field.name, field);
    }

    Object.freeze(this);
  }

  static deserialize(serializedSchema) {
    const normalizedSchema =
            this.serializationFormat.normalize(serializedSchema);

    const { name } = normalizedSchema;

    const fields = normalizedSchema.fields.
            map(Field.deserialize.bind(Field));
    const deadline = new Date(normalizedSchema.deadline);

    const instance = new this(name, fields, deadline);

    return instance;
  }

  serialize() {
    // TODO: implement
  }

  retrieveAllPossibleFields(category) {
    const fields =
            [...this.fields.values()].map((field) => {
              return [field].concat(
                field.retrievePossibleInsertionFields(category));
            });

    return Array.prototype.concat.apply([], fields);
  }

  retrievePossibleAttachmentSchemata(category) {
    const schemata = [...this.fields.values()].map((field) => {
      return field.retrievePossibleAttachmentSchemata(category);
    });

    return Array.prototype.concat.apply([], schemata);
  }
}
staticize(Schema);

module.exports = Schema;
