
const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server
const proxy = httpProxy.createProxyServer({});

// Listen for incoming traffic on the specified port
const port = 50000; // replace with the desired port
http.createServer((req, res) => {
  proxy.web(req, res, { target: 'http://localhost:' + port });
}).listen(80);
  