/* eslint-env mocha */

'use strict';

const assert = require('assert');

const LiteralValueOperator = require('../operators/value_operators/literal_value_operator');
const MatchOperator = require('../operators/match_operator');
const AndOperator = require('../operators/and_operator');

describe('LiteralValueOperator', () => {
  it('should return value literally', () => {
    const op = new LiteralValueOperator();
    op.value = 1;

    assert(op.mongoize() === 1);
  });
});

describe('MatchOperator', () => {
  it('should return value literally', () => {
    const op = new MatchOperator();
    op.form = 'formA';
    op.field = 'fieldA';
    op.value = new LiteralValueOperator();
    op.value.value = 1;

    assert.deepEqual(op.mongoize(), { 'formA.fieldA': 1 });
  });
});

describe('AndOperator', () => {
  it('should return value literally', () => {
    const op = new AndOperator();
    op.operators = [
      (Object.assign(new MatchOperator(), {
        form: 'formA',
        field: 'fieldA',
        value: (Object.assign(new LiteralValueOperator(), {
          value: 1
        }))
      })),
      (Object.assign(new MatchOperator(), {
        form: 'formA',
        field: 'fieldB',
        value: (Object.assign(new LiteralValueOperator(), {
          value: 2
        }))
      }))
    ];

    assert.deepEqual(op.mongoize(), {
      $and: [
        { 'formA.fieldA': 1 },
        { 'formA.fieldB': 2 },
      ]
    });
  });
});
