'use strict';

const assert = require('assert');

const NamedObjectMap = require('./named_object_map');

class Schema {
  constructor(category, { name, fields, deadline }) {
    this.category = category;

    this._fields = new NamedObjectMap();

    this.name = name;
    this.fields = fields;
  }

  set fields(fields) {
    this._fields.replaceWith(fields);
  }

  get fields() {
    return [...this._fields.values()];
  }

  retrieveAllPossibleFields() {
    const fields =
            this.fields.map((field) => {
              return [field].concat(
                field.retrievePossibleInsertionFields());
            });

    return Array.prototype.concat.apply([], fields);
  }

  retrievePossibleAttachmentSchemata() {
    const schemata = this.fields.map((field) => {
      return field.retrievePossibleAttachmentSchemata();
    });

    return Array.prototype.concat.apply([], schemata);
  }

  serialize() {
    const { name, fields } = this;

    return {
      name,
      fields: fields.map(field => {
        return {
          $type: field.constructor.name,
          $parameter: field.serialize(),
        };
      })
    };
  }
}

module.exports = Schema;
