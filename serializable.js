'use strict';

const assert = require('assert');

const NamedObjectMap = require('./named_object_map');

const { createInstanceMapper } = require('./mappers');

class Serializable {
  static property(name, mapper) {
    if (!Object.hasOwnProperty.call(this, 'properties')) {
      this.properties = Object.create(this.properties);
    }
    this.properties[name] = mapper;
  }

  static reference(name, Class) {
    if (!Object.hasOwnProperty.call(this, 'references')) {
      this.references = Object.create(this.references);
    }
    const idProperty = `${name}_${Class.primaryKey}`;
    this.references[name] = { Class, idProperty };
  }

  static version(version) {
    assert(typeof version === 'number');
    this.version = version;
  }

  deserialize(obj) {
    const { properties, references, version } = this.constructor;

    assert(obj.$version === version,
           `incompatible version: ${obj.$version} to ${version}`);

    /* eslint-disable guard-for-in */

    for (const key in properties) {
      assert(Object.hasOwnProperty.call(obj, key), `missing property: ${key}`);

      this[key] = properties[key].deserialize.call(this, obj[key]);
    }

    for (const key in references) {
      const { Class, idProperty } = references[key];
      if (Object.hasOwnProperty.call(obj, key)) {
        this[key] = new Class().deserialize(obj[key]);
      } else {
        assert(Object.hasOwnProperty.call(obj, idProperty));
        this[idProperty] = obj[idProperty];
      }
    }

    /* eslint-enable guard-for-in */

    return this;
  }

  serialize(embeds = {}) {
    const { properties, references, version } = this.constructor;

    const obj = {
      $version: version,
    };

    /* eslint-disable guard-for-in */

    for (const key in properties) {
      obj[key] = properties[key].serialize.call(this, this[key], embeds[key]);
    }

    for (const key in references) {
      const { Class, idProperty } = references[key];
      if (Object.hasOwnProperty.call(embeds, key)) {
        assert(Object.hasOwnProperty.call(this, key),
               `not resolved property: ${key}`);
        obj[key] = this[key].serialize(embeds[key]);
      } else {
        obj[idProperty] = this[key][Class.primaryKey];
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
      const { Class, idProperty } = references[key];
      if (!this[key]) {
        assert(Object.hasOwnProperty.call(this, idProperty));
        const resolve = Class.resolver(this[idProperty]).
                then(resolved => resolved.resolveReferences());
        promises.push(resolve);
      }
    }

    /* eslint-enable guard-for-in */

    return Promise.all(promises);
  }

  static resolver() {
    return Promise.reject(new Error('not implemented'));
  }
}
Serializable.properties = Object.create(null);
Serializable.references = Object.create(null);
Serializable.version = 0;
Serializable.primaryKey = 'id';
//Serializable.property('metadata', {});
//Serializable.property('namespace', '');

module.exports = Serializable;
