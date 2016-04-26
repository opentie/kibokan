'use strict';

const assert = require('assert');

const Serializable = require('./serializable');

const NamedObjectMap = require('./named_object_map');

const Form = require('./form');
const Fields = require('./fields');
const Validators = require('./validators');
const OptionItem = require('./option_item');
// DIRTY HACK: resolve circular references
OptionItem.property('insertionFields', [], [Fields]);

class Category extends Serializable {
  constructor(initialValues) {
    super(null, initialValues);
  }

  set forms(forms) {
    this._forms = NamedObjectMap.fromArray(forms);
  }

  get forms() {
    return [...this._forms.values()];
  }

  get rootForm() {
    return this.resolve(this.rootFormName);
  }

  resolve(formName) {
    assert(this._forms.has(formName), `no such form: ${formName}`);

    return this._forms.get(formName);
  }

  createForm(...args) {
    return new Form(this, ...args);
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
Category.property('rootFormName', null);
Category.property('forms', [], [Form]);

module.exports = Category;
