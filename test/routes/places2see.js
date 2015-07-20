var login = require('./middlewares/login')
var url = require("url");
var querystring = require("querystring");

module.exports = function(app) {
  app.get('/places2see',
    function(req, res) {

      // prepare data to render with html
      var mydata = {};
      if (req.isAuthenticated()){
        var U = req.user;
        U.isVisitor = false;
        U.isUser = true;
        mydata.user = U;
      }else{
        var U = {};
        U.isVisitor = true;
        U.isUser = false;
        mydata.user = U;
        mydata.env = {
            AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
            AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
            AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || global.cburl
        };
      }

      // parse the query string
      var urlquery = url.parse(req.url).query;
      if(urlquery == null){
        res.render('temp_places2see', mydata);
      }else{
        var place = querystring.parse(urlquery)["pl"];
        switch(place){ 
          case "chapel": res.render('chapel', mydata); break;
          case "gravesite": res.render('gravesite', mydata); break;
          case "lostbattalion": res.render('lostbattalion', mydata); break;
          case "montfaucon": res.render('montfaucon', mydata); break;
          case "ps4": res.render('ps4', mydata); break;
          case "visitor": res.render('visitor', mydata); break;
          default: res.render('temp_places2see', mydata);
        }
      }
    });
}
