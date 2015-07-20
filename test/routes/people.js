
var login = require('./middlewares/login');
var request = require("request");

module.exports = function(app) {

  app.get('/people',function(req, res) {

    var url = 'http://ec2-52-6-13-67.compute-1.amazonaws.com/rest/ww1_sql/SoldierRecord?app_name=ww1&order=first_name';
    var SoldierRecord=null;

     request({
          url: url,
          json: true
        }, function (error, response, body) {

          if (!error && response.statusCode === 200) {

            SoldierRecord=body.record;     
   
          }
         if (req.isAuthenticated()){
                  var U = req.user;
                  U.isVisitor = false;
                  U.isUser = true;
                  
                  res.render('temp_people', {
                  user: U,
                  record: SoldierRecord
                });

          }else{
                  var U = {};
                  U.isVisitor = true;
                  U.isUser = false;

                res.render('temp_people', {
                  user: U,
                  env: {
                    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
                      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
                      AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || global.cburl
                  },
                  record: SoldierRecord
                });
            }

         //console.log("[API]Got records:"+SoldierRecord);  

        });
 

  });

}
