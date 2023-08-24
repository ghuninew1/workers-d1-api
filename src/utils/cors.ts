export default {
    origin: '*',
    credentials: true,
    allowHeaders: [ 'X-Custom-Header', 'Upgrade-Insecure-Requests','Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date' ],
    allowMethods: [ 'GET', 'OPTIONS', 'POST', 'PUT', 'DELETE' ],
};
