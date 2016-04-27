'use strict';

const NamedObjectMap = require('../named_object_map');

const Validators = new NamedObjectMap();

module.exports = Validators;

const BaseValidator = require('./base_validator');
const StringValidator = require('./string_validator');
const MaxlengthValidator = require('./maxlength_validator');
const MinlengthValidator = require('./minlength_validator');
const NumericValidator = require('./numeric_validator');
const MaxvalueValidator = require('./maxvalue_validator');
const MinvalueValidator = require('./minvalue_validator');
const ListValidator = require('./list_validator');
const MaxitemsValidator = require('./maxitems_validator');
const MinitemsValidator = require('./minitems_validator');

Validators.add(MaxlengthValidator);
Validators.add(MinlengthValidator);
Validators.add(NumericValidator);
Validators.add(MaxvalueValidator);
Validators.add(MinvalueValidator);
Validators.add(MaxitemsValidator);
Validators.add(MinitemsValidator);

Object.assign(Validators, {
  BaseValidator,

  StringValidator,

  MaxlengthValidator,
  MinlengthValidator,
  NumericValidator,
  MaxvalueValidator,
  MinvalueValidator,

  ListValidator,

  MaxitemsValidator,
  MinitemsValidator,
});
