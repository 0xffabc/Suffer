const net = require("net");
const dns = require("dns");
const datagram = require("dgram");
const udp = datagram.createSocket('udp4');
const sockets = [];
const fake = `HTTP/1.1 200 OK
Connection: Keep-Alive
Content-Type: text/html; charset=utf-8
Content-Length: 1

a`;

net.createServer(socket => {
  udp.on("message", (msg, info) => socket.write([0, info.port, ...Buffer.from(info.address), ...msg]));
  socket.on("data", data => {
    const buf = Array.from(data);
    switch (buf.shift()) {
      case 0:
        const port = buf.shift();
        const addr = buf.splice(0, 4);
        
        udp.send(buf, 0, buf.length, port, `${addr[0]}.${addr[1]}.${addr[2]}.${addr[3]}`);
        break;
      case 1:
        dns.lookup(String.fromCharCode(buf.slice(2, buf.length)), { family: buf[1] }, (err, solval) => {
          const addr = solval[0].address;
          socket.write([1, buf[0], Buffer.from(addr)]);
        });
        break;
      case 2:
        const isOpening = buf.shift() > 127;
        const sockId = buf.shift();
        
        if (isOpening) {
          sockets[sockId] = new net.Socket();
          sockets[sockId].on("data", data => socket.write([2, sockId, ...data]));
          sockets[sockId].on("close", err => {
            socket.write([2, sockId, 2]);
          });
          sockets[sockId].on("error", err => socket.write([2, sockets[sockId]]));
        } else if (sockets[sockId]) {
          sockets[sockId].write(buf);
        }
        break;
      default:
        socket.write(fake);
    }
  }).on("error", () => {})
    .on("close", () => {});
}).listen(3000);

console.log("Running Suffer backend on port 3000.");
