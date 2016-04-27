'use strict';

const assert = require('assert');

const NamedObjectMap = require('../named_object_map');

const Fields = new NamedObjectMap();

module.exports = Fields;

const BaseField = require('./base_field');
const StringBaseField = require('./string_base_field');
const SelectableBaseField = require('./selectable_base_field');
const TextField = require('./text_field');
const ParagraphField = require('./paragraph_field');
const RadioField = require('./radio_field');

Fields.add(TextField);
Fields.add(ParagraphField);
Fields.add(RadioField);

Object.assign(Fields, {
  BaseField,
  StringBaseField,
  SelectableBaseField,

  TextField,
  ParagraphField,
  RadioField,
});
