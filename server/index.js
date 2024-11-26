const net = require('net');
const dgram = require('dgram');

const IpParser = require('./parsers/IpParser.js');
const Logger = require('../logger/index.js');
const Config = require('../config/index.js');
const CipherAgent = require('../cipher/index.js');

class Server {
  constructor(socket) {
    this.socket = socket;
    this.ipParser = new IpParser();
    this.logger = new Logger('Server');
    this.config = new Config();
    this.cipher = new CipherAgent();

    this.socket.once('data', this.start.bind(this));
  }

  async start(data) {
    const { port, host, splitComb, isUDP } = this.ipParser.parse(await this.cipher.decrypt(data));
    this.logger.log('Connecting to', port, host, isUDP ? ', UDP connection' : ', TCP connection');
  
    if (isUDP) this.bindUDP(host, port, splitComb);
    else this.bindTCP(host, port, splitComb);
  }

  bindTCP(host, port, splitComb) {
    this.destSocket = net.createConnection({ host, port }, () => {
      if (splitComb.length) this.destSocket.write(splitComb);
      
      this.logger.log('Authentication successful. Piping messages');
      this.logger.log('Split comb is ', splitComb);
    });

    this.socket.on('error', this.closeSocket.bind(this));
    this.socket.on('end', this.closeSocket.bind(this));
    this.socket.on('close', this.closeSocket.bind(this));
    
    this.destSocket.on('error', this.closeSocket.bind(this));
    this.destSocket.on('end', this.closeSocket.bind(this));
    this.destSocket.on('close', this.closeSocket.bind(this));
    
    this.destSocket.on('data', async data => 
      this.socket.write(await this.cipher.encrypt(data)));
    this.socket.on('data', async data => 
      this.destSocket.write(await this.cipher.decrypt(data)));
  }

  bindUDP(host, port, splitComb) {
    this.udpClient = dgram.createSocket('udp4');

    this.socket.on('error', this.closeSocket.bind(this));
    this.socket.on('end', this.closeSocket.bind(this));
    this.socket.on('close', this.closeSocket.bind(this));
    
    this.udpClient.on('message', async data => 
      this.socket.write(await this.cipher.encrypt(data)));
    this.socket.on('data', async data => {
      const packed = await this.cipher.decrypt(data);
      
      this.udpClient.send(packed, 0, packed.length, port, host);
    });

    this.udpClient.on('error', () => {
      this.socket.end();
    });
  }

  closeSocket() {
    this.socket.end();
    this.destSocket.end();
  }
}

net.createServer(clientSocket => {
  new Server(clientSocket);
}).listen(new Config().port, () => console.log(`[*] server listening!`));
