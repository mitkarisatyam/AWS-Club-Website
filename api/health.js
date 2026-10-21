const app = require('../server');

module.exports = (req, res) => {
  if (!req.url.startsWith('/api/health')) {
    req.url = '/api/health' + (req.url === '/' ? '' : req.url);
  }
  return app(req, res);
};
