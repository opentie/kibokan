'use strict';

const Serializable = require('./serializable');
const { arrayOf, polymorphic, identical, categorized } = require('./mappers');

const Fields = require('./fields');

class OptionItem extends Serializable {
  // for NamedObjectMap
  get name() {
    return this.label;
  }
}

OptionItem.property('label', identical);
OptionItem.property('insertionFields', arrayOf(polymorphic(categorized, Fields)));
OptionItem.property('deadline', identical);

module.exports = OptionItem;
