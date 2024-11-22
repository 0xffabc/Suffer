const ClientTunnel = require('./tunnel/index.js');
const net = require('net');

console.log('== Suffer v1.0 -> Proxy for penetrating censorship ==');

let host = '0.0.0.0';
let port = 443;

/**
  * Create socks5 server. We don't need authentification
  * Because we only need to capture packets
  * So, we omit first authentification packet and select NoAuth mode
  * At the next packet, we automatically reply with success code
  * And then pipe serverSocket to current socket, to cast every message on
  * The desired server.

  * Note: for each socks5 connection we create a new
  * encrypted tunnel
**/

net.createServer(async socket => {
  socket.once('data', data => {
    console.log('[authlib] new client, atm skip to none auth');
    const version = data[0];
    const messageQueue = [];

    if (version != 5) {
      socket.write(`HTTP/1.1 200 OK
Connection: Keep-Alive
Content-Type: text/html; charset=utf-8
Content-Length: 1

a`);
      return socket.end();
    } else socket.write(Buffer.from([5, 0]));
   
    socket.once('data', data => {
      let host_raw;
      const cmd = data[1];
      const destAddrType = data[3];
      
      if (destAddrType == 1) {
        host_raw = data.slice(4, 8);
        host = host_raw.join('.');
        port = data.readUInt16BE(8);
      } else if (destAddrType == 3) {
        const addrLen = data[4];
        host_raw = data.slice(5, 5 + addrLen);
        host = host_raw.toString();
        port = data.readUInt16BE(5 + addrLen);
      } else return socket.end();

      socket.write(Buffer.from([5, 0, 0, destAddrType, ...host_raw, port >> 8, port & 0xFF]));
      socket.on('error', () => socket.end());
      socket.on('data', packet => {
        if (tunnel.opened) return tunnel.send(packet);
        messageQueue.push(packet);
      });

      const tunnel = new ClientTunnel(global.config.host, global.config.port, host_raw, port || 443, socket);
      tunnel.onOpen = () => messageQueue.forEach(_ => tunnel.send(_));
    });
  });
}).listen(global.config.localPort || 1080);
