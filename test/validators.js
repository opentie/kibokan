/* eslint-env mocha */

'use strict';

const assert = require('power-assert');

const {
  MaxlengthValidator,
  MinlengthValidator,
  MaxvalueValidator,
  MinvalueValidator,
  ListValidator,
  MaxitemsValidator,
  MinitemsValidator,
} = require('../validators');

describe('MaxlengthValidator', () => {
  it('should return false to not a string', () => {
    const validator = new MaxlengthValidator(10);

    assert(validator.validate(100) === false);
  });

  context('when parameter = 10', () => {
    const validator = new MaxlengthValidator(10);

    it('should return true to "goodbye"', () => {
      assert(validator.validate('goodbye') === true);
    });

    it('should return false to "hello world"', () => {
      assert(validator.validate('hello world') === false);
    });
  });
});

describe('MinlengthValidator', () => {
  it('should return false to not a string', () => {
    const validator = new MinlengthValidator(10);

    assert(validator.validate(100) === false);
  });

  context('when parameter = 11', () => {
    const validator = new MinlengthValidator(11);

    it('should return false to "goodbye"', () => {
      assert(validator.validate('goodbye') === false);
    });

    it('should return false to "hello world"', () => {
      assert(validator.validate('hello world') === true);
    });
  });
});

describe('MaxvalueValidator', () => {
  context('always', () => {
    const validator = new MaxvalueValidator(100);

    it('should return false to not a string', () => {
      assert(validator.validate(10) === false);
    });

    it('should return false to a non-numeric string', () => {
      assert(validator.validate('non numeric string') === false);
    });
  });

  context('when parameter = 3', () => {
    const validator = new MaxvalueValidator(3);

    it('should return false to a non-numeric string', () => {
      assert(validator.validate('non numeric string') === false);
    });

    it('should return false to "4"', () => {
      assert(validator.validate('4') === false);
    });

    it('should return true to "3"', () => {
      assert(validator.validate('3') === true);
    });
  });
});

describe('MinvalueValidator', () => {
  context('always', () => {
    const validator = new MinvalueValidator(10);

    it('should return false to not a string', () => {
      assert(validator.validate(100) === false);
    });

    it('should return false to a non-numeric string', () => {
      assert(validator.validate('non numeric string') === false);
    });
  });

  context('when parameter = 3', () => {
    const validator = new MinvalueValidator(3);

    it('should return false to "2"', () => {
      assert(validator.validate('2') === false);
    });

    it('should return true to "3"', () => {
      assert(validator.validate('3') === true);
    });
  });
});

describe('ListValidator', () => {
  const validator = new ListValidator();

  it('should return false to a non-array', () => {
    assert(validator.validate('hoge') === false);
  });

  it('should return true to an array', () => {
    assert(validator.validate([]) === true);
  });
});

describe('MaxitemsValidator', () => {
  const validator = new MaxitemsValidator(2);

  it('should return false to [1, 2, 3]', () => {
    assert(validator.validate([1, 2, 3]) === false);
  });

  it('should return true to [1, 2]', () => {
    assert(validator.validate([1, 2]) === true);
  });
});

describe('MinitemsValidator', () => {
  const validator = new MinitemsValidator(2);

  it('should return false to [1]', () => {
    assert(validator.validate([1]) === false);
  });

  it('should return true to [1, 2]', () => {
    assert(validator.validate([1, 2]) === true);
  });
});
