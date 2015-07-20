var login = require('./middlewares/login');

module.exports = function(app) {
  app.get('/',
    login.redirectIfAuth('/user'),
    function(req, res) {
      
      var U = {};
      U.isVisitor = true;
      U.isUser = false;

      res.render('temp_home', {
        user: U,
        env: {
          AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
          AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
          AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || global.cburl
        }
      });
    });
}