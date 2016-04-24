'use strict';

const assert = require('assert');

const NamedObjectMap = require('./named_object_map');

function id(val) { return val; }
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
      const instance = new Class(this.category); // TODO: kimoi

      return Object.assgin(instance, properties);
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
      this.properties = Object.assign({}, this.properties);
    }
    this.properties[name] = {
      defaultValue,
      mapper: parse(type)
    };
  }

  constructor(category, initialValues = {}) {
    this.category = category || this;

    const { properties } = this.constructor;

    for (const key of Object.keys(properties)) {
      this[key] = properties[key].defaultValue;
    }

    Object.assign(this, initialValues);
  }

  deserialize(obj) {
    const { properties } = this.constructor;

    for (const key of Object.keys(properties)) {
      this[key] = properties[key].mapper.deserialize.call(this, obj[key]);
    }
  }

  serialize() {
    const { properties } = this.constructor;

    const obj = {};

    for (const key of Object.keys(properties)) {
      obj[key] = properties[key].mapper.serialize.call(this, this[key]);
    }

    return obj;
  }
}
Serializable.properties = {};

module.exports = Serializable;