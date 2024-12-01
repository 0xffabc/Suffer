const ClientTunnel = require('./tunnel/index.js');
const IpParser = require('./parsers/IpParser.js');
const Logger = require('../logger/index.js');
const Config = require('../config/index.js');
const net = require('net');

console.log('== Suffer v1.0 -> Proxy for penetrating censorship ==');

class Client {
  constructor(socket) {
    this.ipParser = new IpParser();
    this.logger = new Logger('Client');
    this.config = new Config();

    this.fakePacket = new Response('a').bytes();
    this.authPacket = Buffer.from([5, 0]);

    this.messageQueue = [];
    this.socket = socket;

    this.startAuth();
  }

  onHTTPS() {
    this.socket.write(this.fakePacket);
    this.socket.end();
  }

  startAuth() {
    this.socket.once('data', data => {
      if (data[0] != 5) return this.onHTTPS();
      
      this.socket.write(this.authPacket);
      this.socket.once('data', this.processURL.bind(this));
    });
  }

  processURL(data) {
    const { host_raw, port, destAddrType } = this.ipParser.parse(data);
    const tunnel = new ClientTunnel(this.config.host, this.config.port, host_raw, port, this.socket, data[1] == 3);
  
    tunnel.onOpen = () => this.messageQueue.forEach(tunnel.send.bind(tunnel));

    this.logger.log('Estabishing connection to ' + host_raw.join('.') + ':' + port);
    
    this.socket.on('error', this.socket.end.bind(this.socket));
    this.socket.on('data', packet => {
      if (tunnel.opened) return tunnel.send(packet);
      this.messageQueue.push(packet);
    });

    this.accept(host_raw, port, destAddrType);
  }
  
  accept(host, port, destType) {
    this.socket.write(Buffer.from([5, 0, 0, destType, ...host, port >> 8, port]));
  }
}

net.createServer(socket => {
  new Client(socket);
}).listen(new Config().localPort);
