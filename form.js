'use strict';

const { compileDocumentSelector } = require('minimongo/src/selector');

const Serializable = require('./serializable');
const NamedObjectMap = require('./named_object_map');

const Fields = require('./fields');

class Form extends Serializable {
  set fields(fields) {
    this.fieldsMap = NamedObjectMap.fromArray(fields);
  }

  get fields() {
    return [...this.fieldsMap.values()];
  }

  retrieveAllPossibleFields() {
    const fields = this.fields.
            map(field =>
                [field].concat(field.retrievePossibleInsertionFields()));

    return Array.prototype.concat.apply([], fields);
  }

  get compiledAttachable() {
    return compileDocumentSelector(this.attachable);
  }
}
Form.property('name', '');
Form.property('fields', [], [Fields]);
Form.property('release', null);
Form.property('deadline', null);
Form.property('attachable', {});
Form.property('isRequired', false);

module.exports = Form;
