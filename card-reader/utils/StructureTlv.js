const Tlv = require('./Tlv');

class StructureTlv extends Tlv {
  constructor(tag, length, children) {
    super(tag, length);

    this.children = children;
  }

  addValuesToDict(tagPrefix, dict) {
    this.children.forEach(tlv => {
      tlv.addValuesToDict(this.getTagKeyWithPrefix(tagPrefix), dict);
    });

    return dict;
  }
}

module.exports = StructureTlv;
