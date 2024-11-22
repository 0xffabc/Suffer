const net = require('net');

class ClientTunnel {
  constructor(host, port, destination, destPort, socket) {
    this.socket = net.createConnection({
      host,
      port
    }, () => {
      this.opened = true;
      const message = Buffer.concat([
        Buffer.from([destination.length]),
        Buffer.from(destination),
        Buffer.from([destPort >> 8, destPort & 0xFF])
      ]);
      this.socket.write(message);
      this.onOpen();

      console.log('[suffer] authentification successful!', message);
    });

    this.socket.on('error', _ => console.log('[  ERR!  ] Host returned error'));
    this.socket.on('data', _ => socket.write(_));
  }

  send(data) {
    console.log(`[arch] writing message`, data);
    this.socket.write(new Uint8Array(data));
  }
}

module.exports = ClientTunnel;
