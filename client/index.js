const ClientTunnel = require('./tunnel/index.js');
const IpParser = require('./parsers/IpParser.js');
const net = require('net');

console.log('== Suffer v1.0 -> Proxy for penetrating censorship ==');

class Server {
  constructor(socket) {
    this.ipParser = new IpParser();

    this.fakePacket = new Response("a").bytes();
    this.authPacket = Buffer.from([5, 0]);

    this.messageQueue = [];
    this.socket = socket;

    this.startAuth();
  }

  log(data) {
    console.log(`[${new Date().toLocaleTimeString()}] ${data}`);
  }

  onHTTPS() {
    this.socket.write(this.fakePacket);
    this.socket.end();
  }

  startAuth() {
    socket.once('data', data => {
      if (data[0] != 5) return this.onHTTPS();

      socket.once('data', data => this.processURL(data));
    });
  }

  processURL(data) {
    const { host_raw, port, destAddrType } = this.ipParser.parse(data);
    const tunnel = new ClientTunnel(global.config.host, global.config.port, host_raw, port || 443, socket);
  
    tunnel.onOpen = () => this.messageQueue.forEach(tunnel.send.bind(tunnel));

    this.log('Estabishing connection to ' + host_raw.join('.') + ':' + port);
    this.accept(host_raw, port, destAddrType);
    this.socket.on('error', () => this.socket.end());
    this.socket.on('data', packet => {
      if (tunnel.opened) return tunnel.send(packet);
      this.messageQueue.push(packet);
    });
  }
  
  accept(host, port, destType) {
    this.socket.write(Buffer.from([5, 0, 0, destType, ...host, port >> 8, port]));
  }
}

net.createServer(socket => {
  new Server(socket);
}).listen(global.config.localPort || 1080);
