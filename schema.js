'use strict';

const assert = require('assert');

const Serializable = require('./serializable');
const NamedObjectMap = require('./named_object_map');

const Fields = require('./fields');

class Schema extends Serializable {
  set fields(fields) {
    this._fields = NamedObjectMap.fromArray(fields);
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
}
Schema.property('name', '');
Schema.property('fields', [], [Fields]);

module.exports = Schema;
