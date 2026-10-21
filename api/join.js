const app = require('../server');

module.exports = (req, res) => {
  if (!req.url.startsWith('/api/join')) {
    req.url = '/api/join' + (req.url === '/' ? '' : req.url);
  }
  return app(req, res);
};
