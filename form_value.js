'use strict';

const NamedObjectMap = require('./named_object_map');

const FieldValue = require('./field_value');

class FormValue {
  constructor(form, value) {
    this.form = form;

    this.fieldValues = new NamedObjectMap();
    if (value === true) {
      this.isValid = true;
      this.state = 'Rejected';
      for (const field of this.form.fields) {
        this.constructFieldValues({}, field);
      }
    } else if (value === false) {
      this.isValid = true;
      this.state = 'NotAttached';
      for (const field of this.form.fields) {
        this.constructFieldValues({}, field);
      }
    } else {
      this.state = 'Filled';
      for (const field of this.form.fields) {
        this.constructFieldValues(value, field);
      }
      this.isValid = [...this.fieldValues.values()].
        every(fieldValue => fieldValue.isValid);
    }

    Object.freeze(this);
  }

  constructFieldValues(rawValue, field) {
    const fieldValue = new FieldValue(field, rawValue[field.name]);
    this.fieldValues.add(fieldValue);

    fieldValue.insertionFields.
      map(insertionField =>
          this.constructFieldValues(rawValue, insertionField));
  }

  get name() {
    return this.form.name;
  }

  get value() {
    if (this.state === 'NotAttached') {
      return null;
    } else if (this.state === 'Rejected') {
      return true;
    }

    const value = {};
    for (const fieldValue of this.fieldValues.values()) {
      value[fieldValue.name] = fieldValue.value;
    }

    return value;
  }
}

module.exports = FormValue;
