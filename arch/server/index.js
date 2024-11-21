const net = require("net");

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


module.exports = Server;
