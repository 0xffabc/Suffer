const net = require('net');

const server = net.createServer(clientSocket => {
  console.log('[server] Client connected, awaiting auth');

  clientSocket.once('data', data => {
    if (data.length < 3) return clientSocket.end();
   
    const destinationLength = data[0];
    const destination = data.slice(1, 1 + destinationLength).join(".");
    const destPort = data[1 + destinationLength] << 8 | data[2 + destinationLength];
    const totalLength = 3 + destinationLength;
    const splitComb = data.slice(totalLength, data.length);

    const destinationSocket = net.createConnection({ host: destination, port: destPort }, () => {
      console.log('[server] Authentication successful. Initializing ciphers');
      if (splitComb.length > 0) {
        console.log(`[antidpi-detect?] Found merged part and added to queue`, splitComb);
        destinationSocket.write(new Uint8Array(splitComb));
      }
    });

    clientSocket.on('data', packet => destinationSocket.write(packet));
    destinationSocket.on('data', packet => clientSocket.write(packet));

    clientSocket.on('error', err => destinationSocket.end());
    destinationSocket.on('error', err => {
      console.error('[server] Destination connection error:', err);
      clientSocket.end();
    });
  });
});

server.listen(global.config.port, () => {
  console.log(`[server] Listening on port ${global.config.port}`);
});
