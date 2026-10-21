const app = require('../server');

module.exports = (req, res) => {
  if (!req.url.startsWith('/api/feedback')) {
    req.url = '/api/feedback' + (req.url === '/' ? '' : req.url);
  }
  return app(req, res);
};
