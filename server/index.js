const net = require('net');
const IpParser = require('./parsers/IpParser.js');
const Logger = require('../logger/index.js');

class Server {
  constructor(socket) {
    this.socket = socket;
    this.ipParser = new IpParser();
    this.logger = new Logger('Server');

    this.socket.once('data', this.start.bind(this));
  }

  start(data) {
    const { port, host, splitComb } = this.ipParser.parse(data);
  
    this.destSocket = net.createConnection({ host, port }, () => {
      if (splitComb.length) this.destSocket.write(splitComb);
      
      this.logger.log('Authentication successful. Piping messages');
      this.logger.log('Split comb is ', splitComb);
    });

    this.socket.pipe(this.destSocket);
    this.socket.on('error', this.destSocket.end.bind(this.destSocket));
    
    this.destSocket.on('error', this.socket.end.bind(this.socket));
    this.destSocket.pipe(this.socket);
  }
}

net.createServer(clientSocket => {
  new Server(clientSocket);
}).listen(global.config.port, () => console.log(`[server] Listening on port ${global.config.port}`));
