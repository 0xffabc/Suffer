const brotli = require("brotli");

module.exports = new class Cipher {
  set(key) {
    this.bytesBase = key.split("").map(e => e.charCodeAt(0));
  }

  pack(data) {
    return brotli.compress(data);
  }

  unpack(data) {
    return brotli.decompress(data);
  }
}
