const net = require("net");
const dns = require("dns");
const datagram = require("dgram");

net.createServer(socket => {
  console.log("[*] Client connected");

  socket.on("data", data => {
    switch (data.shift()) {
      case 0:
        console.log("[UDP] ");
        break;
      case 1:
        console.log("[DNS] Resolving ");
        break;
      case 2:
        console.log("[TCP] Making request");
        break;
    }
  });
}).listen(3000);

console.log("Running Suffer backend on port 3000.");
