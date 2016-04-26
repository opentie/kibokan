const assert = require('assert');

class NamedObjectMap extends Map {
  add(object) {
    assert('name' in object);

    this.set(object.name, object);
  }

  replaceWith(objects) {
    this.clear();

    for (let object of objects) {
      this.add(object);
    }
  }

  static fromArray(objects) {
    const instance = new this();
    instance.replaceWith(objects);

    return instance;
  }
}

module.exports = NamedObjectMap;
