const net = require('net');
const Logger = require('../../logger/index.js');
const CipherAgent = require('../../cipher/index.js');

class ClientTunnel {
  constructor(host, port, destination, destPort, socket) {
    this.logger = new Logger('ClientTunnel');
    this.cipher = new CipherAgent();
    
    this.socket = net.createConnection({
      host,
      port
    }, () => {
      this.opened = true;
      const message = Buffer.concat([
        Buffer.from([destination.length]),
        Buffer.from(destination),
        Buffer.from([destPort >> 8, destPort])
      ]);
      
      this.send(message);
      this.onOpen();

      this.logger.log('authentification successful!', message);
    });

    this.socket.on('error', _ => this.logger.log('Host returned error!!', _));
    this.socket.on('data', _ => this.cipher.decrypt(_).then(socket.write.bind(socket)));
  }

  send(data) {
    this.logger.log('writing message', data);
    this.cipher.encrypt(new Uint8Array(data)).then(this.socket.write.bind(this.socket));
  }
}

module.exports = ClientTunnel;
