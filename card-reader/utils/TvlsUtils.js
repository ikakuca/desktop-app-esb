/* eslint-disable */

const Utils = require('./Utils');
const SimpleTlv = require('./SimpleTlv');
const StructureTlv = require('./StructureTlv');

module.exports = {
  parse(data, bytesFrom, bytesTo) {
    const tlvs = [];

    if (bytesFrom < 0 || bytesTo > data.length) {
      throw new Error('Index out of data range');
    }

    while (bytesFrom < bytesTo) {
      if (data[bytesFrom] == 0x00) break;

      // get tag size
      let tagByteSize = 1;
      if ((data[bytesFrom] & 0x1f) == 0x1f) {
        tagByteSize++;
        while (
          bytesFrom + tagByteSize - 1 < bytesTo &&
          (data[bytesFrom + tagByteSize - 1] & 0x80) == 0x80
        ) {
          tagByteSize++;
        }
      }

      // get tag
      let tag = data.slice(bytesFrom, bytesFrom + tagByteSize);
      bytesFrom += tagByteSize;

      // get length size
      let lenByteSize = 1;
      if ((data[bytesFrom] & 0x80) == 0x80) {
        lenByteSize += 0x7f & data[bytesFrom];
      }

      if (lenByteSize > 1) {
        bytesFrom++;
        lenByteSize -= 1;
      }

      // get length
      let lenBytes = data.slice(bytesFrom, bytesFrom + lenByteSize);
      let len = Utils.bytes2IntLE(lenBytes);
      bytesFrom += lenBytes.length;

      // get value
      let tlv = null;
      if ((tag[0] & 0x20) == 0x20) {
        // new structure with subtags
        let childTlvs = this.parse(data, bytesFrom, bytesFrom + len);

        tlv = new StructureTlv(tag, len, childTlvs);
      } else {
        let value = data.slice(bytesFrom, bytesFrom + len);
        tlv = new SimpleTlv(tag, len, value);
      }

      bytesFrom += len;
      tlvs.push(tlv);
    }

    return tlvs;
  },
  getValuesDict(tlvs, dict) {
    for (const tlv of tlvs) {
      tlv.addValuesToDict(null, dict);
    }

    return dict;
  }
};
