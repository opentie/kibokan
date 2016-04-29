'use strict';

const assert = require('assert');

const NamedObjectMap = require('./named_object_map');
const Serializable = require('./serializable');
const { arrayOf, identical, categorized } = require('./mappers');

const Form = require('./form');
const Fields = require('./fields');
const Validators = require('./validators');
const OptionItem = require('./option_item');

class Category extends Serializable {
  constructor() {
    super();

    this.category = this;
  }

  set forms(forms) {
    this.formsMap = NamedObjectMap.fromArray(forms);
  }

  get forms() {
    return [...this.formsMap.values()];
  }

  getFormByName(formName) {
    assert(this.formsMap.has(formName), `no such form: ${formName}`);

    return this.formsMap.get(formName);
  }

  // helper methods
  createForm(props) {
    return Object.assign(new Form(), props, { category: this });
  }

  createField(className, props) {
    const Field = Fields.get(className);

    return Object.assign(new Field(), props, { category: this });
  }

  createValidator(className, props) {
    const Validator = Validators.get(className);

    return Object.assign(new Validator(), props, { category: this });
  }

  createOptionItem(props) {
    return Object.assign(new OptionItem(), props, { category: this });
  }
}
Category.property('name', identical);
Category.property('forms', arrayOf(categorized(Form)));
Category.primaryKey = 'name';

module.exports = Category;
