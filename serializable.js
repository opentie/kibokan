'use strict';

const assert = require('assert');

const NamedObjectMap = require('./named_object_map');

function id(val) {
  return val;
}

const idMapper = {
  serialize: id,
  deserialize: id,
};

function createInstanceMapper(Class) {
  return {
    serialize: function serializeInstance(instance) {
      return instance.serialize();
    },
    deserialize: function deserializeInstance(properties) {
      // TODO: kimoi
      const instance = new Class(this.category);

      return instance.deserialize(properties);
    }
  };
}

function createArrayMapper(itemMapper) {
  return {
    serialize: function serializeArray(array) {
      return array.map(itemMapper.serialize.bind(this));
    },
    deserialize: function deserializeArray(array) {
      return array.map(itemMapper.deserialize.bind(this));
    }
  };
}

function createPolymorphicMapper(mapping) {
  return {
    serialize: function serializePolymorphic(instance) {
      const Class = instance.constructor;

      return {
        $class: Class.name,
        $properties: createInstanceMapper(Class).serialize.call(this, instance),
      };
    },
    deserialize: function deserializePolymorphic({ $class, $properties }) {
      const Class = mapping.get($class);

      return createInstanceMapper(Class).deserialize.call(this, $properties);
    }
  };
}

function parse(option) {
  if (option instanceof NamedObjectMap) {
    return createPolymorphicMapper(option);
  }

  if (Array.isArray(option)) {
    assert(option.length === 1);

    const itemMapper = parse(option[0]);

    return createArrayMapper(itemMapper);
  }

  if (option === true) {
    return idMapper;
  }

  return createInstanceMapper(option);
}

class Serializable {
  static property(name, defaultValue, type = true) {
    if (!Object.hasOwnProperty.call(this, 'properties')) {
      this.properties = Object.create(this.properties);
    }
    this.properties[name] = {
      defaultValue,
      mapper: parse(type)
    };
  }

  static version(version) {
    assert(typeof version === 'number');
    this.version = version;
  }

  constructor(category, initialValues = {}) {
    this.category = category || this;

    const { properties } = this.constructor;

    /* eslint-disable guard-for-in */

    for (const key in properties) {
      this[key] = properties[key].defaultValue;
    }

    /* eslint-enable guard-for-in */

    Object.assign(this, initialValues);
  }

  deserialize(obj) {
    const { properties, version } = this.constructor;

    assert(obj.$version === version,
           `incompatible version: ${obj.$version} to ${version}`);

    /* eslint-disable guard-for-in */

    for (const key in properties) {
      assert(Object.hasOwnProperty.call(obj, key), `missing property: ${key}`);

      this[key] = properties[key].mapper.deserialize.call(this, obj[key]);
    }

    /* eslint-enable guard-for-in */

    return this;
  }

  serialize() {
    const { properties, version } = this.constructor;

    const obj = {
      $version: version,
    };

    /* eslint-disable guard-for-in */

    for (const key in properties) {
      obj[key] = properties[key].mapper.serialize.call(this, this[key]);
    }

    /* eslint-enable guard-for-in */

    return obj;
  }
}
Serializable.properties = Object.create(null);
Serializable.version = 0;

module.exports = Serializable;
