'use strict';

const util = require('util');

class Validity {
  constructor(value, errors = [], children = new Map()) {
    this.value = value;
    this.errors = errors;
    this.children = children;
  }

  get isValid() {
    const validity =
            this.errors.length === 0 &&
            [...this.children.values()].every((child) => child.isValid);

    return validity;
  }

  toString() {
    function concat (aryA, aryB) {
      return aryA.concat(aryB);
    }

    function toLines (validity) {
      const errors = (validity.errors.join(', ') || 'no errors');
      const inspection = util.inspect(validity.value, { depth: 0 });

      return [
        `${errors} (${inspection})`
      ].concat([...validity.children].map(([key, child]) => {
        const [head, ...tail] = toLines(child);

        return [
          `  ${key}: ${head}`
        ].concat(tail.map((line) => `  ${line}`));
      }).reduce(concat, []));
    }

    return toLines(this).join('\n');
  }

  force() {
    if (!this.isValid) {
      throw new Error(`Validation failed\n${this.toString()}`);
    }

    return true;
  }
}

class AbstractSchema {
  static get optionSchema() {
    return new NoopSchema();
  }

  constructor(option = {}) {
    if (this.constructor === AbstractSchema) {
      throw new TypeError('Illigal constructor');
    }

    this.rawOption = option;
    this.option = this.constructor.optionSchema.normalize(this.rawOption);
  }

  validate(value) {
    return new Validity(value);
  }

  normalize(value) {
    const validity = this.validate(value);
    validity.force();

    return value;
  }

  merge(other) {
    if (!(other instanceof this.constructor)) {
      throw new TypeError('Invalid argument');
    }

    return other;
  }
}

class NoopSchema extends AbstractSchema {
  static get optionSchema() {
    // HACK: avoid stack overflow
    return {
      normalize: function id (value) {
        return value;
      },
      validate: AbstractSchema.prototype.validate
    };
  }
}

class ClassSchemaBase extends AbstractSchema {
  validate(value) {
    return (value instanceof this.option.class)
      ? new Validity(value)
      : new Validity(value, [`not a "${this.class}"`]);
  }
}

class ClassSchema extends ClassSchemaBase {
  static get optionSchema() {
    return new ObjectSchemaBase({
      extraProperties: false,
      propertySchema: new NoopSchema(),
      properties: {
        class: {
          required: true,
          default: Nothing,
          schema: new ClassSchemaBase({ class: Function })
        }
      }
    });
  }
}

class StringSchema extends AbstractSchema {
  validate(value) {
    return (typeof value === 'string')
      ? new Validity(value)
      : new Validity(value, ['not a string']);
  }
}

class NumberSchema extends AbstractSchema {
  validate(value) {
    return (typeof value === 'number')
      ? new Validity(value)
      : new Validity(value, ['not a number']);
  }
}

class BooleanSchema extends AbstractSchema {
  validate(value) {
    return (typeof value === 'boolean')
      ? new Validity(value)
      : new Validity(value, ['not a boolean']);
  }
}

class NullSchema extends AbstractSchema {
  validate(value) {
    return (value === null)
      ? new Validity(value)
      : new Validity(value, ['not null']);
  }
}

class UndefinedSchema extends AbstractSchema {
  validate(value) {
    return (typeof value === 'undefined')
      ? new Validity(value)
      : new Validity(value, ['not undefined']);
  }
}

class NullableSchema extends AbstractSchema {
  validate(value) {
    return (value === null)
      ? new Validity(value)
      : this.option.schema.validate(value);
  }

  normalize(value_) {
    const value = super.normalize(value_);

    return (value === null)
      ? null
      : this.option.schema.normalize(value);
  }
}

class ArraySchema extends AbstractSchema {
  static get optionSchema() {
    return new ObjectSchema({
      properties: {
        itemSchema: {
          schema: new ClassSchema({ class: AbstractSchema }),
          required: false,
          default: new NoopSchema()
        }
      },
      extraProperties: false
    });
  }

  validate(value) {
    if (Array.isArray(value)) {
      return new Validity(
        value, [],
        Array.prototype.reduce.call(value, (children, item, i) => {
          children.set(i, this.option.itemSchema.validate(item));

          return children;
        }, new Map())
      );
    }

    return new Validity(value, ['not an array']);
  }

  normalize(value) {
    return Array.from(super.normalize(value));
  }
}

function Nothing () {
  return Nothing;
}

class ObjectSchemaBase extends AbstractSchema {
  validate(value) {
    if (typeof value !== 'object') {
      return new Validity(value, ['not an object']);
    }

    const errors = [];
    const children = new Map();
    const keys = new Set(Object.keys(this.option.properties));

    for (let key of keys.values()) {
      const rule = this.option.properties[key];

      if (Object.hasOwnProperty.call(value, key)) {
        children.set(key, rule.schema.validate(value[key]));
      } else if (rule.required) {
        errors.push(`no property "${key}"`);
      }
    }

    const valueKeys = Object.keys(value);
    if (this.option.extraProperties) {
      for (let key of valueKeys) {
        if (!keys.has(key)) {
          children.set(key, this.option.propertySchema.validate(value[key]));
        }
      }
    } else {
      for (let key of valueKeys) {
        if (!keys.has(key)) {
          errors.push(`extra property "${key}"`);
        }
      }
    }

    return new Validity(value, errors, children);
  }

  normalize(value_) {
    const value = super.normalize(value_);
    const normalizedValue = {};
    const keys = new Set(
      Object.keys(this.option.properties).
        concat(Object.keys(value))
    );

    for (let key of keys.values()) {
      let rule = null;
      const schema = Object.hasOwnProperty.call(this.option.properties, key)
              ? (rule = this.option.properties[key]).schema
              : this.option.propertySchema;

      if (Object.hasOwnProperty.call(value, key)) {
        normalizedValue[key] = schema.normalize(value[key]);
      } else if (rule.default !== Nothing) {
        normalizedValue[key] = schema.normalize(rule.default);
      }
    }

    return Object.assign({}, value, normalizedValue);
  }

  mergePropertyRules(ruleA, ruleB) {
    return Object.merge(ruleA, ruleB);
  }

  mergePropertiesOptions(propertiesA, propertiesB) {
    const newPropertiesOption = {};
    const keys = new Set(
      Object.keys(propertiesA).concat(Object.keys(propertiesB)));
    for (let key of keys) {
      const isInA = Object.hasOwnProperty.call(propertiesA, key);
      const isInB = Object.hasOwnProperty.call(propertiesB, key);
      if (isInA && isInB) {
        newPropertiesOption[key] =
          this.mergePropertyRules(propertiesA[key], propertiesB[key]);
      } else if (isInA) {
        newPropertiesOption[key] = propertiesA[key];
      } else if (isInB) {
        newPropertiesOption[key] = propertiesB[key];
      }
    }

    return newPropertiesOption;
  }

  merge(other) {
    if (!(other instanceof this.constructor)) {
      throw new TypeError('Invalid argument');
    }

    const newPropertiesOption = this.mergePropertiesOptions(
      this.option.properties,
      other.option.properties
    );
    const newOption = Object.assign(this.rawOption, other.rawOption, {
      properties: newPropertiesOption
    });

    return new this.constructor(newOption);
  }
}

class ObjectSchema extends ObjectSchemaBase {
  static get optionSchema() {
    const PROPERTIES_SCHEMA = new ObjectSchemaBase({
      extraProperties: true,
      propertySchema: new ObjectSchemaBase({
        extraProperties: true,
        propertySchema: new NoopSchema(),
        properties: {
          required: {
            required: false,
            schema: new BooleanSchema(),
            default: true
          },
          default: {
            required: false,
            schema: new NoopSchema(),
            default: Nothing
          },
          schema: {
            required: false,
            schema: new ClassSchema({ class: AbstractSchema }),
            default: new NoopSchema()
          }
        }
      }),
      properties: {}
    });

    return new ObjectSchemaBase({
      extraProperties: false,
      propertySchema: new NoopSchema(),
      properties: {
        extraProperties: {
          required: false,
          default: true,
          schema: new BooleanSchema(),
        },
        propertySchema: {
          required: false,
          default: new NoopSchema(),
          schema: new ClassSchema({ class: AbstractSchema }),
        },
        properties: {
          required: false,
          default: {},
          schema: PROPERTIES_SCHEMA,
        }
      }
    });
  }
}

module.exports = {
  Validity,
  AbstractSchema,
  NoopSchema,
  ClassSchema,
  ObjectSchema,
  ArraySchema,
  BooleanSchema,
  NumberSchema,
  StringSchema,
  NullSchema,
  NullableSchema,
  UndefinedSchema,
  Nothing,
};
