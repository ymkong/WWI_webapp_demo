var login = require('./middlewares/login')
var url = require("url");
var querystring = require("querystring");

module.exports = function(app) {
  app.get('/tellstories',
    function(req, res) {
      if (req.isAuthenticated()){
        var U = req.user;
        U.isVisitor = false;
        U.isUser = true;

        // parse the URL here
        // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
        // console.log(url.parse(req.url).pathname);

        var urlquery = url.parse(req.url).query;

        if(urlquery == null){
          console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
          console.log("tell story wo coordinate");
          console.log("not about certain people");
          U.incoming_lat = 0;
          U.incoming_lng = 0;
          U.about_people = 0;
        }else{
          if(querystring.parse(urlquery)["lat"] != null){
            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
            console.log("tell story w coordinate");
            console.log(querystring.parse(urlquery)["lat"]);
            console.log(querystring.parse(urlquery)["lng"]);
            var lat = parseFloat(querystring.parse(urlquery)["lat"]);
            var lng = parseFloat(querystring.parse(urlquery)["lng"]);
            console.log(lat);
            console.log(lng);
            U.incoming_lat = lat;
            U.incoming_lng = lng;

            if(querystring.parse(urlquery)["character_id"] != null){
              var cid = parseInt(querystring.parse(urlquery)["character_id"]);
              var fn = querystring.parse(urlquery)["first_name"];
              var ln = querystring.parse(urlquery)["last_name"];
              U.about_people = 1;
              U.character_id = cid;
              U.fn = fn;
              U.ln = ln;
            }else{
              U.about_people = 0;
            }
          }else{
          
            U.incoming_lat = 0;
            U.incoming_lng = 0;

            if(querystring.parse(urlquery)["character_id"] != null){
              var cid = parseInt(querystring.parse(urlquery)["character_id"]);
              var fn = querystring.parse(urlquery)["first_name"];
              var ln = querystring.parse(urlquery)["last_name"];
              U.about_people = 1;
              U.character_id = cid;
              U.fn = fn;
              U.ln = ln;
              console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
              console.log("tell story about people");
              console.log(fn);
              console.log(ln);

            }else{
              console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
              console.log("tell story NOT about people");
              U.about_people = 0;
            }
          }
        }
        res.render('temp_tellstories', {
          user: U
        });
      }else{
        var U = {};
        U.isVisitor = true;
        U.isUser = false;

		    res.render('temp_plslogin', {
          user: U,
          env: {
            AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
            AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
            AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || global.cburl
          }
        });
      }
    });
}