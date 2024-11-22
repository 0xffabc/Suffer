const net = require('net');
const IpParser = require('./parsers/IpParser.js');

const ipParser = new IpParser();

net.createServer(clientSocket => {
  clientSocket.once('data', data => {
    const { destPort, destination, splitComb } = ipParser.parse(data);

    const destinationSocket = net.createConnection({ host: destination, port: destPort }, () => {
      if (splitComb.length) destinationSocket.write(splitComb);
      
      console.log('[server] Authentication successful.');
    });

    clientSocket.pipe(destinationSocket);
    clientSocket.on('error', err => destinationSocket.end());
    
    destinationSocket.on('error', err => clientSocket.end());
    destinationSocket.pipe(clientSocket);
  });
}).listen(global.config.port, () => console.log(`[server] Listening on port ${global.config.port}`));
