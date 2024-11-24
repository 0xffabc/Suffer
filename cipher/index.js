const util = require('util');
const zlib = require('zlib');
const Logger = require('../logger/index.js');

const brotliCompress = util.promisify(zlib.brotliCompress);
const brotliDecompress = util.promisify(zlib.brotliDecompress);

class Cipher {
  constructor(key = [0, 1, 0]) {
    this.key = key;
    this.logger = new Logger('Compressor');

    this.logger.log('Compressor init, TODO: Fix Brotli increasing packet size 45x');
  }

  // TODO: Add actual encryption via tls module
  async encrypt(data) {
    //data = await brotliCompress(data);
    return new Uint8Array(data);
  }

  async decrypt(data) {
    //data = await brotliDecompress(data);
    return new Uint8Array(data);
  }
}

module.exports = Cipher;
