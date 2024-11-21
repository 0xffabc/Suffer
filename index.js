
console.log('[*] Reading config');

const offset = process.argv.indexOf(process.argv.find(_ =>
  _.includes('index.js')));

const config = global.config = {
  endpoint: process.argv[offset + 1],
  port: process.argv[offset + 2],
  server: !!process.argv[offset + 3]
}

console.log(`[config] Parsed from cmdline
Tunnel endpoint -> ${config.endpoint}
Port -> ${config.port}
Running server? -> ${config.server}`);

if (config.server) {
  require("./server/index.js");
} else require("./client/index.js");
