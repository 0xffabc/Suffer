const net = require("net");

class Server {
  constructor(config) {
    this.interface = config.interface;
    this.cipher = config.cipher;
    this.server = net.createServer(socket => {
      socket.once("data", data => {
        console.log(data);

        console.log(`[server] piping socket to ${data}`);
      });
    }).listen(7912);
  }
}


module.exports = Server;
