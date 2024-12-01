const Config = require('./config/index.js');
const config = new Config();

console.log(`[config] Parsed from cmdline
Tunnel endpoint -> ${config.endpoint}
Port -> ${config.port}
Running server? -> ${config.server}`);

if (new Config().server) require("./server/index.js");
else require("./client/index.js");
