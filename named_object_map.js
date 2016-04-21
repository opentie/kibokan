const assert = require('assert');

class NamedObjectMap extends Map {
  add(object) {
    assert(Object.hasOwnProperty.call(object, 'name'));

    this.set(object.name, object);
  }

  replaceWith(objects) {
    this.clear();

    for (let object of objects) {
      this.add(object);
    }
  }
}

module.exports = NamedObjectMap;
