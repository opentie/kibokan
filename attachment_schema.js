'use strict';

const assert = require('assert');

const {
  ObjectSchema,
  ArraySchema,
  BooleanSchema,
  StringSchema,
} = require('./lowlevel');

const Schema = require('./schema');

class AttachmentSchema extends Schema {
}

module.exports = AttachmentSchema;
