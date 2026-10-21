const app = require('../server');

module.exports = (req, res) => {
  if (!req.url.startsWith('/api/events')) {
    req.url = '/api/events' + (req.url === '/' ? '' : req.url);
  }
  return app(req, res);
};
