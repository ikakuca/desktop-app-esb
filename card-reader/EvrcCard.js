/* eslint-disable */

const smartcard = require('smartcard');
const { StringDecoder } = require('string_decoder');
const Utils = require('./utils/Utils');
const TvlsUtils = require('./utils/TvlsUtils');
const { VEHICLE_TAGS, PERSONAL_TAGS, DOCUMENT_TAGS } = require('./EvrcInfo');

const { CommandApdu, Iso7816Application } = smartcard;

const decoder = new StringDecoder('utf8');

module.exports = class EvrcCard {
  constructor(card) {
    this.EF_Registration_A = Array.prototype.slice.call(
      new Int8Array([0xd0, 0x01])
    );
    this.EF_Registration_B = Array.prototype.slice.call(
      new Int8Array([0xd0, 0x11])
    );
    this.EF_Registration_C = Array.prototype.slice.call(
      new Int8Array([0xd0, 0x21])
    );
    this.EF_SerbianRegis_D = Array.prototype.slice.call(
      new Int8Array([0xd0, 0x31])
    );

    this.vehicle = {};
    this.personal = {};
    this.document = {};

    this.BLOCK_SIZE = 0x64;

    this.application = new Iso7816Application(card);
  }

  async fetchEvrcInfo() {
    const dict = {};
    let data = [];
    let parsedData = null;

    await this.selectAID();

    data = await this.readElementaryFile(this.EF_Registration_A);
    parsedData = TvlsUtils.parse(data, 0, data.length);
    TvlsUtils.getValuesDict(parsedData, dict);

    data = await this.readElementaryFile(this.EF_Registration_B);
    parsedData = TvlsUtils.parse(data, 0, data.length);
    TvlsUtils.getValuesDict(parsedData, dict);

    data = await this.readElementaryFile(this.EF_Registration_C);
    parsedData = TvlsUtils.parse(data, 0, data.length);
    TvlsUtils.getValuesDict(parsedData, dict);

    data = await this.readElementaryFile(this.EF_SerbianRegis_D);
    parsedData = TvlsUtils.parse(data, 0, data.length);
    TvlsUtils.getValuesDict(parsedData, dict);

    return this.parseInfo(dict);
  }

  parseInfo(dict) {
    Object.keys(VEHICLE_TAGS).forEach(tag => {
      const vehicleKey = VEHICLE_TAGS[tag];
      const dictTag = tag.toLowerCase();

      if (!dict[dictTag]) {
        return;
      }

      this.vehicle[vehicleKey] = decoder.write(Buffer.from(dict[dictTag]));
    });

    Object.keys(PERSONAL_TAGS).forEach(tag => {
      const personalKey = PERSONAL_TAGS[tag];
      const dictTag = tag.toLowerCase();

      if (!dict[dictTag]) {
        return;
      }

      this.personal[personalKey] = decoder.write(Buffer.from(dict[dictTag]));
    });

    Object.keys(DOCUMENT_TAGS).forEach(tag => {
      const documentKey = DOCUMENT_TAGS[tag];
      const dictTag = tag.toLowerCase();

      if (!dict[dictTag]) {
        return;
      }

      this.document[documentKey] = decoder.write(Buffer.from(dict[dictTag]));
    });

    return {
      vehicle: this.vehicle,
      personal: this.personal,
      document: this.document
    };
  }

  async selectAID() {
    const aid = Array.prototype.slice.call(
      new Int8Array([
        0xa0,
        0x00,
        0x00,
        0x00,
        0x18,
        0x65,
        0x56,
        0x4c,
        0x2d,
        0x30,
        0x30,
        0x31
      ])
    );

    const response = await this.application.issueCommand(
      new CommandApdu({
        cla: 0x00,
        ins: 0xa4,
        p1: 0x04,
        p2: 0x0c,
        data: aid
      })
    );

    if (response.isOk()) {
      return;
    }

    process.exit(1);
  }

  async readElementaryFile(name) {
    const res = await this.selectFile(name);

    if (!res.isOk()) {
      process.exit(1);
    }

    const HEADER_SIZE = 0x20;

    // Read first block of bytes from the EF
    const header = await this.readBinary(0, HEADER_SIZE);

    // Get the second tag length
    if (header[0] != 0x78) {
      process.exit(1);
    }

    let offset = header[1] + 3;

    // TODO: figure out what happens here...
    let lenByteSize = 1;
    if ((header[offset] & 0x80) == 0x80) {
      lenByteSize += 0x7f & header[offset];
    }
    if (lenByteSize > 1) {
      lenByteSize--;
      offset++;
    }
    const lenBytes = header.slice(offset, offset + lenByteSize);
    const length = Utils.bytes2IntLE(lenBytes);
    const dataLength = length + offset + lenByteSize;

    // Read binary into buffer
    const next = await this.readBinary(HEADER_SIZE, dataLength - HEADER_SIZE);

    return header.concat(next);
  }

  async readBinary(offset, length) {
    let out = [];
    const BLOCK_SIZE = 0x64;

    while (length > 0) {
      const readSize = Math.min(length, BLOCK_SIZE);

      const response = await this.application.issueCommand(
        new CommandApdu({
          cla: 0x00,
          ins: 0xb0,
          p1: offset >> 8,
          p2: offset & 0xff,
          le: readSize
        })
      );

      const data = Array.prototype.slice.call(
        new Int8Array(response.buffer),
        0,
        response.buffer.length - 2
      );

      out = out.concat(data);

      offset += data.length;
      length -= data.length;
    }

    return out;
  }

  async selectFile(data) {
    const response = await this.application.issueCommand(
      new CommandApdu({
        cla: 0x00,
        ins: 0xa4,
        p1: 0x02,
        p2: 0x04,
        data
      })
    );

    if (response.isOk()) {
      return response;
    }

    process.exit(1);
  }
};
