class OptionItem {
  constructor(category, { label, insertionFields, attachmentNames, deadline }) {
    this.category = category;

    this.label = label;
    this.insertionFields = insertionFields;
    this.attachmentNames = attachmentNames;
    this.deadline = deadline;
    this.isDeadlineSet = (this.deadline !== null);
  }

  retrievePossibleAttachmentSchemata() {
    const resolve = this.category.resolve.bind(this.category);
    const attachments = this.attachmentNames.map(resolve).map((schema) => {
      return [schema].concat(schema.retrievePossibleAttachmentSchemata());
    });

    return Array.prototype.concat.apply([], attachments);
  }
}

module.exports = OptionItem;
