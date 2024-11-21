/**
  * Todo: separate to classes (refactor)
  
  * start' starts the server
**/

const net = require("net");
const Client = require("./client/index.js");
const Server = require("./server/index.js");

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
