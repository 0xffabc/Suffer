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

class ClientTunnel {
  constructor(host, port, destination, destPort) {
    this.socket = net.createConnection({
      host,
      port
    });
    this.socket.on('connection', () => {
      console.log(`[client] starting authentification process`);
      const message = Buffer.concat([
        Buffer.from([destination.length]),
        Buffer.from(destination),
        Buffer.from([destPort >> 8, destPort & 0xFF])
      ]);
      this.socket.write(message);

      console.log('[suffer] authentification successful!', message);
      console.log('You have been connected to the web via secure tunnel');
    });

    this.socket.on('error', _ => console.log('[  ERR!  ] Host returned error'));
    this.socket.on('data', _ =>
      this.onmessage(_));
  }

  send(data) {
    this.socket.write(new Uint8Array(data));
  }
}

net.createServer(async socket => {
  let arch;

  socket.once('data', data => {
    console.log('[authlib] new client, atm skip to none auth');
    const version = data[0];
    if (version !== 5) {
      socket.write(`HTTP/1.1 200 OK
Connection: Keep-Alive
Content-Type: text/html; charset=utf-8
Content-Length: 1

a`);
      return socket.end();
    }

    const nMethods = data[1];
    const methods = data.slice(2, 2 + nMethods);
    socket.write(Buffer.from([5, 0]));

    socket.once('data', data => {
      let host_raw;
      const cmd = data[1];
      const destAddrType = data[3];
      console.log('[protoc] set host/port pair', data);

      if (destAddrType === 1) {
        host = data.slice(4, 8).join('.');
        host_raw = data.slice(4, 8);
        port = data.readUInt16BE(8);
      } else if (destAddrType === 3) {
        const addrLen = data[4];
        host = data.slice(5, 5 + addrLen).toString();
        host_raw = data.slice(5, 5 + addrLen);
        port = data.readUInt16BE(5 + addrLen);
      } else {
        return socket.end();
      }

      const tunnel = new ClientTunnel(global.config.host, global.config.port, host_raw, port || 443);

      socket.on('data', packet => tunnel.send(packet));
      tunnel.onmessage = packet => socket.write(packet);

      socket.on('error', () => serverSocket.end());
    });
  });
}).listen(global?.config?.localPort || 1080);

console.log('[suffer] local proxy ran');
