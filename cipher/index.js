const util = require('util');
const zlib = require('zlib');
const Logger = require('../logger/index.js');

const brotliCompress = util.promisify(zlib.brotliCompress);
const brotliDecompress = util.promisify(zlib.brotliDecompress);

class Cipher {
  constructor(key = [0, 1, 0]) {
    this.key = key;
    this.logger = new Logger('Compressor');
  }

  // TODO: Add actual encryption via tls module
  async encrypt(data) {
    const compressed = await brotliCompress(data);
    this.logger.log('Sending', compressed);
    return compressed;
  }

  async decrypt(data) {
    this.logger.log(data);
    const decompressed = await brotliDecompress(data);
    this.logger.log('Receiving', decompressed);
    return decompressed;
  }
}

module.exports = Cipher;
