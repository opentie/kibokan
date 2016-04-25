'use strict';

const assert = require('assert');

const Form = require('./form');

class ReferenceForm extends Form {
  constructor(category, params) {
    super(category, params);

    const { deadline, query } = params;

    this.deadline = deadline;
    this.query = query;
  }

  serialize() {
    const serialized = super.serialize();
    const { deadline, query } = this;

    return Object.assign(serialized, {
      deadline,
      query, // TODO: Do it well
    });
  }
}

module.exports = ReferenceForm;
