'use strict';

const assert = require('assert');

const NamedObjectMap = require('./named_object_map');
const Serializable = require('./serializable');

const FormValue = require('./form_value');

class Entity extends Serializable {
  constructor(initialValues) {
    super(null, initialValues);
  }

  retrieveAttachableFormsMap(onlyMissing = false) {
    return NamedObjectMap.fromArray(this.category.forms.filter(form => {
      if (onlyMissing && Object.hasOwnProperty.call(this.document, form.name)) {
        return false;
      }

      return form.isAttachable(this.document);
    }));
  }

  resolveForm(formName) {
    const formsMap = this.retrieveAttachableFormsMap();
    assert(formsMap.has(formName), `not attachable form: ${formName}`);

    return formsMap.get(formName);
  }

  _assign(document) {
    const availableFormsMap = this.retrieveAttachableFormsMap(true);
    const updatedForms = [];

    for (const form of availableFormsMap.values()) {
      if (Object.hasOwnProperty.call(document, form.name)) {
        const formValue = new FormValue(form, document[form.name]);
        if (!formValue.isValid) {
          throw new Error('invalid form value');
        }
        this.document[form.name] = formValue.value;
        updatedForms.push(form);
      }
    }

    return updatedForms;
  }

  update(document) {
    this.document = {};
    let allUpdatedForms = [];
    let updatedForms = [];
    while ((updatedForms = this._assign(document)).length > 0) {
      allUpdatedForms = allUpdatedForms.concat(updatedForms);
    }

    return allUpdatedForms;
  }

  normalize() {
    const document = this.document;
    return this.update(document);
  }
}
Entity.property('category', null);
Entity.property('document', {});

module.exports = Entity;
