const net = require('net');

const server = net.createServer(clientSocket => {
  console.log('[server] Client connected, awaiting auth');

  clientSocket.once('data', data => {
    if (data.length < 3) {
      console.log('[server] Invalid authentication frame! Probably Deep packet inspection is used.');
      return clientSocket.end();
    }
   
    const destinationLength = data[0];
    const destination = data.slice(1, 1 + destinationLength).join(".");
    const destPort = data[1 + destinationLength] << 8 | data[2 + destinationLength];
    
    console.log(`[server] Authenticating to destination ${destination}:${destPort}`);
    console.log(`[authlib1.5] Received authentification frame `, data);

    const destinationSocket = net.createConnection({ host: destination, port: destPort }, () => {
      console.log('[server] Authentication successful. Initializing ciphers');
    });

    clientSocket.on('data', packet => destinationSocket.write(packet));
    destinationSocket.on('data', packet => clientSocket.write(packet));

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
