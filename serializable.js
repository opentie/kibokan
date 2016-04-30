'use strict';

const assert = require('assert');

const { camelize, decamelize } = require('humps');

const NamedObjectMap = require('./named_object_map');

const { identical } = require('./mappers');

class Serializable {
  static property(name, mapper) {
    if (!Object.hasOwnProperty.call(this, 'properties')) {
      this.properties = Object.create(this.properties);
    }
    const serializedKey = decamelize(name);
    this.properties[name] = { mapper, serializedKey };
  }

  static reference(name, Class) {
    if (!Object.hasOwnProperty.call(this, 'references')) {
      this.references = Object.create(this.references);
    }
    const serializedKey = decamelize(name);
    const serializedSuffixedKey = `${serializedKey}_${Class.primaryKey}`;
    const suffixedKey = camelize(serializedSuffixedKey);
    this.references[name] = { Class, suffixedKey, serializedSuffixedKey, serializedKey };
  }

  static version(version) {
    assert(typeof version === 'number');
    this.version = version;
  }

  deserialize(obj, isPartial = false) {
    const { properties, references, version } = this.constructor;

    assert(obj._version === version,
           `incompatible version: ${obj._version} to ${version}`);

    /* eslint-disable guard-for-in */

    for (const key in properties) {
      const { mapper, serializedKey } = properties[key];

      if (Object.hasOwnProperty.call(obj, serializedKey)) {
        this[key] = mapper.deserialize.call(this, obj[serializedKey]);
      } else {
        assert(isPartial || this.constructor.primaryKey === key,
               `missing property: ${serializedKey}`);
      }
    }

    for (const key in references) {
      const {
        Class, serializedSuffixedKey,
        suffixedKey, serializedKey
      } = references[key];
      if (Object.hasOwnProperty.call(obj, serializedKey)) {
        this[key] = new Class().deserialize(obj[serializedKey]);
      } else if (!isPartial) {
        assert(Object.hasOwnProperty.call(obj, serializedSuffixedKey));
        this[suffixedKey] = obj[serializedSuffixedKey];
      }
    }

    /* eslint-enable guard-for-in */

    return this;
  }

  serialize(embeds = {}) {
    const { properties, references, version } = this.constructor;

    const obj = {
      _version: version,
    };

    /* eslint-disable guard-for-in */

    for (const key in properties) {
      const { mapper, serializedKey, weak } = properties[key];
      if (key in this) {
        obj[serializedKey] =
          mapper.serialize.call(this, this[key], embeds[key]);
      } else {
        assert(key === this.constructor.primaryKey, `missing property: ${key}`);
      }
    }

    for (const key in references) {
      const {
        Class, suffixedKey,
        serializedSuffixedKey, serializedKey,
      } = references[key];
      if (Object.hasOwnProperty.call(embeds, key)) {
        assert(Object.hasOwnProperty.call(this, key),
               `not resolved property: ${key}`);
        obj[serializedKey] = this[key].serialize(embeds[key]);
      } else {
        obj[serializedSuffixedKey] = this[key][Class.primaryKey];
      }
    }

    /* eslint-enable guard-for-in */

    return obj;
  }

  isResolved() {
    const { references } = this.constructor;

    /* eslint-disable guard-for-in */

    for (const key in references) {
      if (!this[key]) { return false; }
    }

    /* eslint-enable guard-for-in */

    return true;
  }

  resolveReferences() {
    const { references } = this.constructor;
    const promises = [];

    /* eslint-disable guard-for-in */

    for (const key in references) {
      const { Class, suffixedKey } = references[key];
      if (!this[key]) {
        assert(Object.hasOwnProperty.call(this, suffixedKey));
        const resolve = Class.resolve(this[suffixedKey]).then(resolved => {
          this[key] = resolved;
          resolved.resolveReferences();
        });
        promises.push(resolve);
      }
    }

    /* eslint-enable guard-for-in */

    return Promise.all(promises);
  }

  static resolve() {
    return Promise.reject(new Error('not implemented'));
  }

  get primaryKeyValue() {
    const Class = this.constructor;
    if ('primaryKey' in Class &&
        Object.hasOwnProperty.call(this, Class.primaryKey)) {
      return this[Class.primaryKey];
    }

    return void(0);
  }

  set primaryKeyValue(value) {
    const Class = this.constructor;
    assert('primaryKey' in Class);

    this[Class.primaryKey] = value;
  }
}
Serializable.properties = Object.create(null);
Serializable.references = Object.create(null);
Serializable.version = 0;

module.exports = Serializable;
