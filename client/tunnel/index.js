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
    }, async () => {
      const message = Buffer.concat([
        Buffer.from([destination.length]),
        Buffer.from(destination),
        Buffer.from([destPort >> 8, destPort])
      ]);
      
      await this.send(message);
      this.opened = true;
      this.onOpen();

      this.logger.log('authentification successful!', message);
    });

    this.socket.on('error', _ => this.logger.log('Host returned error!!', _));
    this.socket.on('data', async _ => socket.write(await this.cipher.decrypt(_)));
  }

  async send(data) {
    const dataCompressed = await this.cipher.encrypt(data);
    this.socket.write(dataCompressed);
  }
}

module.exports = ClientTunnel;
