var login = require('./middlewares/login')
var request = require('request');

module.exports = function(app) {

  app.get('/profile',

    function(req, res) {
      if (req.isAuthenticated()){

        var U = req.user;
        U.isVisitor = false;
        U.isUser = true;

        var userid = U._json.ww1_id;
        console.log("aaaaaaaaaaaaa____-story_____paaaaaaaaaaaaaaaa");
        var myurl2 = 'http://ec2-52-6-13-67.compute-1.amazonaws.com/rest/ww1_sql/Story?app_name=ww1&filter=authorID='+userid;
        request({url: myurl2,
          method: 'GET',
          header: {'Content-Type': 'application/json'}
        },
        function(error, response){
          if (error) {
              alert(error.toString());
          }else {
            console.log("xxxxxxxxxxxx____-story_____xxxxxxxxxxxxxxxx");
            var mystorydata = JSON.parse(response.body)['record'];
            console.log(mystorydata);            
            var myurl3 = 'http://ec2-52-6-13-67.compute-1.amazonaws.com/rest/ww1_sql/User?app_name=ww1&ids=' + userid;
            request({url: myurl3,
                    method: 'GET',
                    header: {'Content-Type': 'application/json'}},
            function(error, response){
              if(error){
                alert(error.toString());
              }else{
                console.log("pppppppppppppppppppppppppppppppppppppppp");
                console.log(JSON.parse(response.body));
                var t_tour = JSON.parse(response.body)['record'][0].route;
                if(t_tour == null){
                  console.log("(((((((((((((((((((");
                    console.log("no tour");
                  U.hasTour = 0;
                }else{
                  U.hasTour = 1;
                  U.tour = t_tour.replace(/\?/g, '-->');
                    console.log("(((((((((((((((((((");
                    console.log("has tour");
                    console.log(U.tour);
                }
                res.render('temp_profile', {
                  user: U,
                  ua: mystorydata
                });
              }
            });
          }
        });

      }else{
        var U = {};
        U.isVisitor = true;
        U.isUser = false;

        res.render('temp_plslogin', {
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