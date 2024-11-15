const net = require("net");
const dns = require("dns");
const datagram = require("dgram");
const udp = dgram.createSocket('udp4');
const sockets = [];

net.createServer(socket => {
  socket.on("data", data => {
    const buf = Array.from(data);
    switch (buf.shift()) {
      case 0:
        const port = buf.shift();
        const addr = buf.splice(0, 4);
        
        udp.send(buf.slice(0, buf.length), 0, buf.length, port, `${addr[0]}.${addr[1]}.${addr[2]}.${addr[3]}`);
        break;
      case 1:
        dns.lookup(String.fromCharCode(buf.slice(2, buf.length)), { family: buf[1] }, (err, solval) => {
          const addr = solval[0].address;
          socket.write([buf[0], Buffer.from(addr)]);
        });
        break;
      case 2:
        const isOpening = buf.shift() > 127;
        const sockId = buf.shift();
        
        if (isOpening) {
          sockets[sockId] = new net.Socket();
          sockets[sockId].on("data", data => socket.write([sockId, ...data]));
          sockets[sockId].on("close", err => {
            socket.write([0x2, sockets[sockId]]);
          });
          sockets[sockId].on("error", err => socket.write([0x2, sockets[sockId]]));
        } else if (sockets[sockId]) {
          sockets[sockId].write([sockId, buf]);
        }
        break;
      default:
        socket.write(Buffer.from("HTTP 1.1 \n 404 Not Found".split("").map(e => e.charCodeAt(0))));
    }
  }).on("error", () => {})
    .on("close", () => {});
}).listen(3000);

console.log("Running Suffer backend on port 3000.");
