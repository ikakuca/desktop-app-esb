/* eslint-disable no-bitwise */

module.exports = {
  bytes2IntLE(bytes) {
    let ret = 0;

    if (bytes.length > 3) ret += (bytes[bytes.length - 4] & 0xff) << 24;
    if (bytes.length > 2) ret += (bytes[bytes.length - 3] & 0xff) << 16;
    if (bytes.length > 1) ret += (bytes[bytes.length - 2] & 0xff) << 8;
    if (bytes.length > 0) ret += (bytes[bytes.length - 1] & 0xff) << 0;

    return ret;
  },
  bytes2HexStringCompact(bytes) {
    return this.bytes2HexStringWithSeparator('', bytes);
  },
  bytes2HexStringWithSeparator(separator, bytes) {
    return Buffer.from(bytes).toString('hex');
  }
};
