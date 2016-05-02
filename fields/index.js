'use strict';

const NamedObjectMap = require('../named_object_map');

const Fields = new NamedObjectMap();

module.exports = Fields;

const BaseField = require('./base_field');
const StringBaseField = require('./string_base_field');
const SelectableBaseField = require('./selectable_base_field');
const TextField = require('./text_field');
const ParagraphField = require('./paragraph_field');
const RadioField = require('./radio_field');
const SelectField = require('./select_field');

Fields.add(TextField);
Fields.add(ParagraphField);
Fields.add(RadioField);
Fields.add(SelectField);

Object.assign(Fields, {
  BaseField,
  StringBaseField,
  SelectableBaseField,

  TextField,
  ParagraphField,
  RadioField,
  SelectField,
});
