'use strict';

const { compileDocumentSelector } = require('minimongo/src/selector');

const Serializable = require('./serializable');
const { arrayOf, identical, polymorphic, categorized, instanceOf } = require('./mappers');
const NamedObjectMap = require('./named_object_map');
const OrOperator = require('./operators/or_operator');

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

  isAttachable(document) {
    return this.attachableSelector(document);
  }

  get attachableSelector() {
    return this.compiledAttachableSelector ||
      (this.compiledAttachableSelector =
       compileDocumentSelector(this.attachable.mongoize()));
  }

  set attachable(attachable) {
    this.compiledAttachableSelector = null;
    this._attachable = attachable;
  }

  get attachable() {
    return this._attachable;
  }
}
Form.property('name', identical);
Form.property('fields', arrayOf(polymorphic(categorized, Fields)));
Form.property('release', identical);
Form.property('deadline', identical);
Form.property('attachable', instanceOf(OrOperator));
Form.property('isRequired', identical);
Form.property('metadata', identical);

module.exports = Form;
