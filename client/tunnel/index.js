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

      this.log('authentification successful!', message);
    });

    this.socket.on('error', _ => this.log('Host returned error!!', _));
    this.socket.on('data', _ => socket.write(_));
  }

  log(...data) {
    console.log(`[${new Date().toLocaleTimeString()}] ${data.join(" ")}`);
  }

  send(data) {
    this.log('writing message', data);
    this.socket.write(new Uint8Array(data));
  }
}

module.exports = ClientTunnel;
