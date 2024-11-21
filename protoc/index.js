const brotli = require("brotli");
const msgpack = require("../msgpack/codec.js");

module.exports = new class Cipher {
  set(key) {
    this.bytesBase = key.split("").map(e => e.charCodeAt(0));
  }

  async pack(data) {
    const packed = await msgpack.pack(data);
    //const compressed = brotli.compress(packed);

    return new Uint8Array(packed);
  }

  async unpack(data) {
    // const decoded = brotli.decompress(data);
    const unpacked = await msgpack.unpack(data);

    return new Uint8Array(unpacked);
  }
}
