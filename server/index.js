const net = require('net');

const server = net.createServer((clientSocket) => {
  console.log('[server] Client connected');

  clientSocket.on('data', (data) => {
    if (data.length < 3) {
      console.log('[server] Invalid authentication packet');
      return clientSocket.end();
    }

    const destinationLength = data[0];
    const destination = data.slice(1, 1 + destinationLength).toString();
    const destPort = data[1 + destinationLength] << 8 | data[2 + destinationLength];
    console.log(`[server] Authenticating to destination ${destination}:${destPort}`);

    const destinationSocket = net.createConnection({ host: destination, port: destPort }, () => {
      console.log('[server] Authentication successful!');

      clientSocket.pipe(destinationSocket);
      destinationSocket.pipe(clientSocket);
    });

    destinationSocket.on('error', (err) => {
      console.error('[server] Destination connection error:', err);
      clientSocket.end();
    });
    destinationSocket.on('end', () => {
      console.log('[server] Destination disconnected');
      clientSocket.end();
    });
    
    clientSocket.on('error', (err) => {
      console.error('[server] Client connection error:', err);
      destinationSocket.end();
    });
    clientSocket.on('end', () => {
      console.log('[server] Client disconnected');
      destinationSocket.end();
    });
  });
  clientSocket.on('error', (err) => {
    console.error('[ERR!] -> ', err);
  });
});

const PORT = global.config.port;
server.listen(PORT, () => {
  console.log(`[server] Listening on port ${PORT}`);
});
