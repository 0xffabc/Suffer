const brotli = require("brotli");
const msgpack = require("../msgpack/codec.js");

module.exports = new class Cipher {
  set(key) {
    this.bytesBase = key.split("").map(e => e.charCodeAt(0));
  }

  async pack(data) {
    const packed = await msgpack.pack(data);
    return brotli.compress(packed);
  }

  async unpack(data) {
    const decoded = brotli.decompress(data);
    const data = await msgpack.unpack(decoded);

    return data;
  }
}
