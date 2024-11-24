class Config {
  constructor() {
    this.offset = process.argv.indexOf(process.argv.find(_ =>
  _.includes('index.js')));
  }

  get endpoint() {
    return process.argv[this.offset + 1];
  }

  get port() {
    return process.argv[this.offset + 2];
  }

  get server() {
    return process.argv[this.offset + 3];
  }

  get localPort() {
    return process.argv[this.offset + 4];
  }
}

module.exports = Config;
