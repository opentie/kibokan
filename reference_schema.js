'use strict';

const assert = require('assert');

const Schema = require('./schema');

class ReferenceSchema extends Schema {
  constructor(category, params) {
    super(category, params);

    const { targetName } = params;

    this.targetName = targetName;
  }
}

module.exports = ReferenceSchema;
