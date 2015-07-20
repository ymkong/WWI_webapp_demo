var login = require('./middlewares/login')

module.exports = function(app) {

  app.get('/viewstories',

    function(req, res) {
      if (req.isAuthenticated()){

        var U = req.user;
        U.isVisitor = false;
        U.isUser = true;

        res.render('temp_viewstories', {
          user: U
        });

      }else{
        var U = {};
        U.isVisitor = true;
        U.isUser = false;

        res.render('temp_viewstories', {
          env: {
            AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
            AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
            AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || global.cburl
          },
          user: U
        }); 
      }
    }); 
}