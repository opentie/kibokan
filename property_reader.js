'use strict';

const assert = require('assert');

class PropertyReader {
  constructor (object) {
    this.object = object;
  }

  read(property, type) {
    assert(Object.hasOwnProperty.call(this.object, property));

    const value = this.object[property];

    switch (type) {
    case 'null':
      assert(value === null);
      break;
    case 'array':
      assert(Array.isArray(value));
      break;
    case 'string':
    case 'number':
    case 'boolean':
    case 'object':
      assert(typeof value === type);
      break;
    default:
      throw new TypeError(`Invalid type: ${type}`);
    }

    return value;
  }

  readSwitch(property, mapping) {
    assert(Object.hasOwnProperty.call(this.object, property));

    const value = this.object[property];
  }
}
