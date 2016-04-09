/* eslint-env mocha */
/* eslint no-sync: "off" */

'use strict';

const assert = require('power-assert');

const { ObjectSchema, BooleanSchema } = require('../lowlevel');

describe('ObjectSchema', () => {
  describe('#validate', () => {
    it('should validate input value', () => {
      const schema = new ObjectSchema({
        extraProperties: false,
        properties: {
          hey: {
            required: true,
            default: {},
            schema: new ObjectSchema({
              properties: {
                yo: {
                  required: true,
                  schema: new BooleanSchema()
                }
              }
            })
          },
          foo: {
            required: false,
            default: {},
            schema: new BooleanSchema(),
          }
        }
      });

      assert(
        schema.validate({
          hey: {
            yo: 1
          },
          foo: 2,
          bar: 3
        }).isValid === false
      );

      assert(
        schema.validate({
          hey: {
            yo: true
          },
          foo: false,
        }).isValid === true
      );

      assert(
        schema.validate({
          hey: {
            yo: true
          },
          foo: false,
        }).toString() ===
          [
            'no errors ({ hey: [Object], foo: false })',
            '  hey: no errors ({ yo: true })',
            '    yo: no errors (true)\n  foo: no errors (false)'
          ].join('\n')
      );
    });
  });
});
