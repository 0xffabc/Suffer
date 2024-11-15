const net = require("net");
const dns = require("dns");
const datagram = require("dgram");

net.createServer(socket => {
  socket.on("data", data => {
    const buf = Array.from(data);
    switch (buf.shift()) {
      case 0:
        console.log("[UDP] ");
        break;
      case 1:
        console.log("[DNS] Resolving ");
        break;
      case 2:
        console.log("[TCP] Making request");
        break;
      default:
        console.log("[Unknown/Raw socket] ", buf);
    }
  }).on("error", () => {})
    .on("close", () => {});
}).listen(3000);

console.log("Running Suffer backend on port 3000.");
