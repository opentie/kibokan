'use strict';

class PropertyMapper {
  construct(name, mapper) {
    this.name = name;
    this.mapper = mapper;
  }

  serialize(rich) {
    if (!Object.hasOwnProperty.call(rich, this.name)) {
      throw new TypeError(`No such property: ${this.name}`);
    }

    return this.mapper.serialize(rich[this.name]);
  }

  deserialize(poor) {
    if (!Object.hasOwnProperty.call(poor, this.name)) {
      throw new TypeError(`No such property: ${this.name}`);
    }

    return this.mapper.deserialize(poor[this.name]);
  }
}

class ClassMapper {
  construct(Class) {
    this.Class = Class;
    this.properties = new Map();
  }

  property(propertyName, mapper) {
    const propertyMapper = new PropertyMapper(propertyName, mapper);
    this.properties.set(propertyName, propertyMapper);
  }

  serialize(rich) {
    const poor = {};

    for (let property of this.properties.values()) {
      poor[property.name] = property.serialize(rich);
    }

    return poor;
  }

  deserialize(poor) {
    const rich = new this.Class();

    for (let property of this.properties.values()) {
      rich[property.name] = property.deserialize(poor);
    }

    return rich;
  }
}

class ClassSwitchMapper {
  construct() {
    this.classes = new Map();
  }

  class(Class) {
    this.classes.set(Class.name, new ClassMapper(Class));
  }

  serialize(rich) {
    const className = rich.constructor.name;
    if (!this.classes.has(className)) {
      throw new TypeError(`Invalid value: ${rich}`);
    }

    const mapper = this.classes.get(className);

    return {
      $class: className,
      $parameter: mapper.serialize(rich)
    };
  }

  deserialize(poor) {
    const className = poor.$class;
    
  }
}

class StringMapper {
  serialize() {
    
  }

  deserialize() {
    
  }
}

class DateMapper {
  
}
