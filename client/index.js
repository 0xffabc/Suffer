const ClientTunnel = require('./tunnel/index.js');
const IpParser = require('./parsers/IpParser.js');
const net = require('net');

console.log('== Suffer v1.0 -> Proxy for penetrating censorship ==');

const ipParser = new IpParser();

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
      const response = new Response("a");
      socket.write(await response.bytes());
     
      return socket.end();
    } else socket.write(Buffer.from([5, 0]));
   
    socket.once('data', data => {
      const { host_raw, port, host, destAddrType } = ipParser.parse(data);

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
