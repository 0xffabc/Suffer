const http = require('http')
const { URL } = require('url')

const server = http.createServer(async (req, res) => {
  try {
    const _req = await fetch(atob(req.url.split('=')[1]));
    const _res = await _req.arrayBuffer();

    req.end(new Uint8Array(_res));
  } catch(e) {
    req.end('monkey');
  }
})

server.listen(3000)
