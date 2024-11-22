const net = require('net');
const IpParser = require('./parsers/IpParser.js');

const ipParser = new IpParser();

net.createServer(clientSocket => {
  console.log('[server] Client connected, awaiting auth');

  clientSocket.once('data', data => {
    if (data.length < 3) return clientSocket.end();
    const { destPort, destination, splitComb } = ipParser.parse(data);

    const destinationSocket = net.createConnection({ host: destination, port: destPort }, () => {
      console.log('[server] Authentication successful. Initializing ciphers');
      if (splitComb.length > 0) destinationSocket.write(new Uint8Array(splitComb));
    });

    clientSocket.pipe(destinationSocket);
    clientSocket.on('error', err => destinationSocket.end());
    
    destinationSocket.on('error', err => clientSocket.end());
    destinationSocket.pipe(clientSocket);
  });
}).listen(global.config.port, () => console.log(`[server] Listening on port ${global.config.port}`));
