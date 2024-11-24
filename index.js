const config = require('./config/index.js');

console.log(`[config] Parsed from cmdline
Tunnel endpoint -> ${config.endpoint}
Port -> ${config.port}
Running server? -> ${config.server}`);

if (config.server) require("./server/index.js");
else require("./client/index.js");
