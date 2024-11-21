/**
  * Todo: separate to classes (refactor)
  
  * start' starts the server
**/

const net = require("net");

class Client {
  constructor(config) {
    console.log(`[client] connecting to relay`);

    this.cipher = config.cipher;
    this.socket = net.createConnection({ host: config.host, port: config.port }, () => {
      console.log(`[client] starting authentification process`);

      socket.write(config.cipher.pack({
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

class Server {
  constructor(config) {
    this.cipher = config.cipher;
    this.server = net.createServer(socket => {
      socket.once("data", data => {
        console.log(data);

        console.log(`[server] piping socket to ${data}`);
      });
    });
  }

  start(config) {
    this.server.listen(7912);
  }
}

module.exports = new class Architecture {
  init(config) {
    console.log(`[arch] loading config: ${config.host}:${config.port} ${config.isClient ? "client" : "server"}`);

    if (config.isClient) {
      Object.assign(this, new Client(config));
    } else {
      Object.assign(this, new Server(config));
    }
  }
}
