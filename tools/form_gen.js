const fs = require('fs');
const yaml = require('js-yaml');
const Category = require('../category');
const s = yaml.safeLoad(fs.readFileSync('../test/fixtures/category.yml'));
const cat = new Category().deserialize(s);

const forms = [
  cat.createForm({
    name: '',
    metadata: {
      description: ''
    },
  })
];

cat.forms = cat.forms.concat(forms);
