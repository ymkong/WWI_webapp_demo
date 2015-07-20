var passport =      require('passport'),
    login = require('./middlewares/login');

module.exports = function(app) {
  app.get('/user',
    login.required,
    function(req, res) {
      var U = req.user;
      U.isVisitor = false;
      U.isUser = true;
      console.log("*****************************************");
      console.log(U);
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