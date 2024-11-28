const http = require('http')
const { URL } = require('url')

const server = http.createServer((req, res) => {
  const targetUrl = new URL(req.url.slice(1), `http://${req.headers.host}`)
  http.get(targetUrl, (response) => {
    res.writeHead(response.statusCode, response.headers)
    response.pipe(res)
  }).on('error', () => {
    res.writeHead(500)
    res.end('Error')
  })
})

server.listen(3000)
