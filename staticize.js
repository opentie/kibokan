function staticize (prop, obj) {
  return Object.defineProperty(obj, prop, { value: obj[prop] });
}

module.exports = staticize;
