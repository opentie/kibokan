'use strict';

const assert = require('assert');

class FieldTypesMap extends Map {
  register(FieldType) {
    assert(typeof FieldType.typeName !== 'undefined');
    this.set(FieldType.typeName, FieldType);

    return FieldType;
  }
}

module.exports = new FieldTypesMap();
