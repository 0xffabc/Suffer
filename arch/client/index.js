const net = require("net");

class Client {
  constructor(config) {
    console.log(`[client] connecting to relay`);

    this.cipher = config.cipher;
    this.socket = net.createConnection({ host: config.host, port: config.port }, async () => {
      console.log(`[client] starting authentification process`);
      const enc = await config.cipher.pack({
        ip: config.ip
      });

      this.socket.write(new Uint8Array([5]));
    });

    this.socket.once("data", _ => {
      console.log(`[client] authentificated and ready to use`);
    });
  }

  on(a, callback) {
    this.socket.on("data", async data => {
      const packet = await this.cipher.unpack(data);

      callback(packet);
    });
  }

  async send(protocol, data) {
    const packet = await this.cipher.pack({
      p: protocol, d: data
    });

    this.socket.write(packet);
  }
}

module.exports = Client;
