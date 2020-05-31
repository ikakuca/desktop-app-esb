const Tlv = require('./Tlv');

/* eslint-disable no-param-reassign */
class SimpleTlv extends Tlv {
  addValuesToDict(tagPrefix = '', dict = {}) {
    dict[this.getTagKeyWithPrefix(tagPrefix)] = this.value;

    return dict;
  }
}

module.exports = SimpleTlv;
