const net = require('net');
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

  start(data) {
    const { port, host, splitComb } = this.ipParser.parse(data);
  
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

  closeSocket() {
    this.socket.unpipe(this.destSocket);
    this.destSocket.unpipe(this.socket);
    
    this.socket.end();
    this.destSocket.end();
  }
}

net.createServer(clientSocket => {
  new Server(clientSocket);
}).listen(new Config().port, () => console.log(`[*] server listening!`));
