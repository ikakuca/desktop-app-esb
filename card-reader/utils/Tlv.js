const Utils = require('./Utils');

module.exports = class Tlv {
  constructor(tag, length, value) {
    this.tag = tag;
    this.length = length;
    this.value = value;
  }

  getTag() {
    return this.tag;
  }

  getLength() {
    return this.length;
  }

  getTagKeyWithPrefix(tagPrefix) {
    return (
      (tagPrefix == null ? '' : `${tagPrefix}.`) +
      Utils.bytes2HexStringCompact(this.tag)
    );
  }

  /* eslint-disable class-methods-use-this, no-unused-vars */
  addValuesToDict(tagPrefix = '', dict = {}) {
    throw new Error('You have to implement the method doSomething!');
  }
};
