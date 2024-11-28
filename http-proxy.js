const http = require('http')
const { URL } = require('url')

const server = http.createServer(async (req, res) => {
  const _req = await fetch(atob(req.url.split("=")[1]));
  const _res = await _req.arrayBuffer();

  req.end(new Uint8Array(_res));
})

server.listen(3000)
