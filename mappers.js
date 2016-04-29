'use strict';

const assert = require('assert');

function id(val) {
  return val;
}

const idMapper = {
  serialize: id,
  deserialize: id,
};

function createCategorizedInstanceMapper(CategorizedClass) {
  return {
    serialize: function serializeCategorizedInstance(instance, embeds) {
      assert(instance instanceof CategorizedClass);

      return instance.serialize(embeds);
    },
    deserialize: function deserializeInstance(properties) {
      const instance = new CategorizedClass();
      instance.category = this.category;

      return instance.deserialize(properties);
    }
  };
}

function createInstanceMapper(Class) {
  return {
    serialize: function serializeInstance(instance, embeds) {
      assert(instance instanceof Class);

      return instance.serialize(embeds);
    },
    deserialize: function deserializeInstance(properties) {
      const instance = new Class();

      return instance.deserialize(properties);
    }
  };
};

function createArrayMapper(itemMapper) {
  return {
    serialize: function serializeArray(array, embeds) {
      assert(Array.isArray(array));

      return array.map(item => itemMapper.serialize.call(this, item, embeds));
    },
    deserialize: function deserializeArray(array) {
      return array.map(itemMapper.deserialize.bind(this));
    }
  };
};

function createPolymorphicMapper(instanceMapper, mapping) {
  return {
    serialize: function serializePolymorphic(instance, embeds) {
      const Class = instance.constructor;

      const serialized = instanceMapper(Class).
              serialize.call(this, instance, embeds);

      return {
        _class: Class.name,
        _properties: serialized,
      };
    },
    deserialize: function deserializePolymorphic({ _class, _properties }) {
      assert(mapping.has(_class));
      const Class = mapping.get(_class);

      return instanceMapper(Class).deserialize.call(this, _properties);
    }
  };
};


const mappers = module.exports = {
  idMapper,
  createInstanceMapper,
  createArrayMapper,
  createPolymorphicMapper,
  createCategorizedInstanceMapper,
};

const dsl = {};
dsl.identical = idMapper;
dsl.instanceOf = createInstanceMapper;
dsl.arrayOf = createArrayMapper;
dsl.polymorphic = createPolymorphicMapper;
dsl.categorized = createCategorizedInstanceMapper;

Object.assign(mappers, dsl);
