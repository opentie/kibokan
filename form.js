'use strict';

const assert = require('assert');

const Serializable = require('./serializable');
const NamedObjectMap = require('./named_object_map');

const Fields = require('./fields');

class Form extends Serializable {
  set fields(fields) {
    if (fields.length === 2 && fields[0] === undefined) {
      console.log(fields);
      throw new Error();
    }
    this._fields = NamedObjectMap.fromArray(fields);
  }

  get fields() {
    return [...this._fields.values()];
  }

  retrieveAllPossibleFields() {
    const fields = this.fields.map((field) => {
      return [field].concat(
        field.retrievePossibleInsertionFields());
    });

    return Array.prototype.concat.apply([], fields);
  }
}
Form.property('name', '');
Form.property('fields', [], [Fields]);
Form.property('release', null);
Form.property('deadline', null);
Form.property('attachable', null);
Form.property('required', null);

module.exports = Form;
