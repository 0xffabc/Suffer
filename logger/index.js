const fs = require('fs');

class Logger {
  constructor(className) {
    this.className = className;
    this.initTime = new Date().toLocaleTimeString();
    this.stream = fs.createWriteStream(`logs/${this.initTime}.log`, { flags: 'a+' });
  }

  log(...data) {
    const timestamp = new Date().toLocaleTimeString();
    const message = `[${timestamp}] [${this.className}] ${data.join(' ')}`;

    this.stream.write(message);
    console.log(message);
  }
}

module.exports = Logger;
