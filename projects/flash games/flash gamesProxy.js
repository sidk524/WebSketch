
    const http = require('http');
    const httpProxy = require('http-proxy');
    const proxy = httpProxy.createProxyServer({});
const port = 50000;
    http.createServer((req, res) => {
      proxy.web(req, res, { target: 'http://localhost:' + port });
    }).listen(80);
  