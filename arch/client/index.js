const net = require("net");

class Client {
  constructor(config) {
    console.log(`[client] connecting to relay`);

    this.cipher = config.cipher;
    this.socket = net.createConnection({ host: config.host, port: config.port }, () => {
      console.log(`[client] starting authentification process`);

      this.socket.write(config.cipher.pack({
        ip: config.ip
      }));
    });
  }

  on(a, callback) {
    this.socket.on("data", callback);
  }

  send(protocol, data) {
    this.socket.write(this.cipher.pack({
      protocol, data
    }));
  }
}

module.exports = Client;
