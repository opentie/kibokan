'use strict';

const assert = require('assert');

const NamedObjectMap = require('./named_object_map');

class Entity {
  constructor(category, document) {
    this.category = category;

    // TODO: normalize
    this.document = document;
  }

  retrieveAttachableFormsMap() {
    return NamedObjectMap.fromArray(
      this.category.forms.filter(
        ({ compiledAttachable }) => compiledAttachable(this.document)));
  }

  resolveForm(formName) {
    const formsMap = this.retrieveAttachableFormsMap();
    assert(formsMap.has(formName), `not attachable form: ${formName}`);

    return formsMap.get(formName);
  }

  update(formValue) {
    assert(this.resolveForm(formValue.name) === formValue.form);

    if (!formValue.isValid) {
      return {
        isSuccessful: false,
        changes: [],
      };
    }

    const hasFormValue =
            (Object.hasOwnProperty.call(this.document, formValue.name));
    const changeType = hasFormValue ? 'replacement' : 'addition';

    this.document[formValue.name] = formValue.value;

    // TODO: normalize
    return {
      isSuccessful: true,
      changes: [
        { type: changeType, formName: formValue.name }
      ], // FIXME: it should contain results of normalization
    };
  }
}

module.exports = Entity;
