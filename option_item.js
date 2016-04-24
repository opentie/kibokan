const Serializable = require('./serializable');

const Fields = require('./fields');

class OptionItem extends Serializable {
  retrievePossibleAttachmentSchemata() {
    const resolve = this.category.resolve.bind(this.category);
    const attachments = this.attachmentNames.map(resolve).map((schema) => {
      return [schema].concat(schema.retrievePossibleAttachmentSchemata());
    });

    return Array.prototype.concat.apply([], attachments);
  }
}
OptionItem.property('label', '');
OptionItem.property('insertionFields', [], [Fields]);
OptionItem.property('attachmentNames', [], [true]);
OptionItem.property('deadline', '', true);

module.exports = OptionItem;
