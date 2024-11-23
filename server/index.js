const net = require('net');
const IpParser = require('./parsers/IpParser.js');

class Server {
  constructor(socket) {
    this.socket = socket;
    this.ipParser = new IpParser();

    this.socket.once('data', this.start.bind(this));
  }

  log(...data) {
    console.log(`[${new Date().toLocaleTimeString()}] ${data.join('.')}`);
  }

  start(data) {
    const { port, host, splitComb } = this.ipParser.parse(data);
  
    this.destSocket = net.createConnection({ host, port }, () => {
      if (splitComb.length) this.destSocket.write(splitComb);
      
      this.log('[server] Authentication successful.');
    });

    this.socket.pipe(this.destSocket);
    this.socket.on('error', err => this.destSocket.end());
    
    this.destSocket.on('error', err => this.socket.end());
    this.destSocket.pipe(this.socket);
  }
}

net.createServer(clientSocket => {
  new Server(clientSocket);
}).listen(global.config.port, () => console.log(`[server] Listening on port ${global.config.port}`));
