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
    serialize:
    function serializeCategorizedInstance(instance, embeds, isPartial) {
      assert(instance instanceof CategorizedClass);

      return instance.serialize(embeds, isPartial);
    },
    deserialize: function deserializeInstance(properties, isPartial) {
      const instance = new CategorizedClass();
      instance.category = this.category;

      return instance.deserialize(properties, isPartial);
    }
  };
}

function createInstanceMapper(Class) {
  return {
    serialize: function serializeInstance(instance, embeds, isPartial) {
      assert(instance instanceof Class);

      return instance.serialize(embeds, isPartial);
    },
    deserialize: function deserializeInstance(properties, isPartial) {
      const instance = new Class();

      return instance.deserialize(properties, isPartial);
    }
  };
};

function createArrayMapper(itemMapper) {
  return {
    serialize: function serializeArray(array, embeds, isPartial) {
      assert(Array.isArray(array));

      return array
        .map(item => itemMapper.serialize.call(this, item, embeds, isPartial));
    },
    deserialize: function deserializeArray(array, isPartial) {
      return array
        .map(item => itemMapper.deserialize.call(this, item, isPartial));
    }
  };
};

function createPolymorphicMapper(instanceMapper, mapping) {
  return {
    serialize: function serializePolymorphic(instance, embeds, isPartial) {
      const Class = instance.constructor;

      const serialized = instanceMapper(Class).
              serialize.call(this, instance, embeds, isPartial);

      return {
        _class: Class.name,
        _properties: serialized,
      };
    },
    deserialize:
    function deserializePolymorphic({ _class, _properties }, isPartial) {
      assert(mapping.has(_class));
      const Class = mapping.get(_class);

      return instanceMapper(Class).deserialize.call(this, _properties, isPartial);
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
