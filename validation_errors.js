'use strict';

const VALIDATION_ERRORS = {
  REQUIRED: () => '必須',
  MAXLENGTH: (len) => `${len}文字以内`,
  MINLENGTH: (len) => `${len}文字以上`,
  MAXVALUE: (num) => `${num}以下`,
  MINVALUE: (num) => `${num}以上`,
};

module.exports = VALIDATION_ERRORS;
