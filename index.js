'use strict';

class FieldDefinition {
  
}

class SchemaBase {
  constructor(option) {
    
  }
}

class RootSchemaBase extends SchemaBase {
  
}

class SubSchemaBase extends SchemaBase {

}

class Namespace {
  constructor() {
    this.schemata = new Map();
    this.rootSchema = null;

    const namespace = this;
    this.Schema =
      class Schema extends SchemaBase {
        constructor(...args) {
          super(...args);
          this.namespace = namespace;
        }
      };
    this.RootSchema =
      class RootSchema extends RootSchemaBase {
        constructor(...args) {
          super(...args);
          this.namespace = namespace;
        }
      };
    this.SubSchema =
      class SubSchema extends SubSchemaBase {
        constructor(...args) {
          super(...args);
          this.namespace = namespace;
        }
      };
  }
}

module.exports = {
  Namespace
};
