var login = require('./middlewares/login')
var request = require('request');

module.exports = function(app) {
  app.get('/love',
    function(req, res) {
      var myurl = 'http://ec2-52-6-13-67.compute-1.amazonaws.com/rest/ww1_sql/Story?app_name=ww1&filter=category="love"';
      request({url: myurl,
                method: 'GET',
                header: {'Content-Type': 'application/json'}
              }, 
          function(error, response) {
          if (error) {
              alert(error.toString());
          }else {

            var ua = JSON.parse(response.body)['record'];

            var authorid_arr = [];
            for(var i = 0; i < ua.length; i++){
              authorid_arr.push(ua[i].authorID);
            }
            console.log("**********authorid_arr***********************");
            console.log(authorid_arr);
            var myurl2 = 'http://ec2-52-6-13-67.compute-1.amazonaws.com/rest/ww1_sql/User?app_name=ww1';
            request({url: myurl2,
              method: 'GET',
              header: {'Content-Type': 'application/json'}
            },
            function(error, response){
              if(error){
                alert(error.toString())
              }else{
                var user_all = JSON.parse(response.body)['record'];
                console.log("***************user 54 ************************");
                console.log(user_all[54]);
                
                for(var i = 0; i < authorid_arr.length; i++){
                  for(var j = 0; j < user_all.length; j++){
                    if(user_all[j].id == authorid_arr[i]){
                      ua[i].authorname = user_all[j].nickname;
                    }
                  }
                }
                // for(var i = 0; i < authorid_arr.length; i++){
                //   ua[i].authorname = user_all[authorid_arr[i]-1].nickname;
                // }

                var id_arr = [];
                for(var i = 0; i < ua.length; i++){
                  id_arr.push(ua[i].idStory);
                  ua[i].comment = [];
                }

                // ua is json array
                // for each json obj us in in ua, we want to find us.idStory, and find array of comments for that idStory
                // and store it under the key comment
                
                var myurl = 'http://ec2-52-6-13-67.compute-1.amazonaws.com/rest/ww1_sql/Comment?app_name=ww1';
                request({url: myurl,
                  method: 'GET',
                  header: {'Content-Type': 'application/json'}
                },
                function(error, response){
                  if(error){
                    alert(error.toString())
                  }else{
                    var com_all = JSON.parse(response.body)['record'];
                    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");                
                    console.log(com_all);
                    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");                
                    console.log(id_arr);

                    // for each comment, find its user's nickname through cuser
                    for(var i = 0; i < com_all.length; i++){
                      for(var j = 0; j < user_all.length; j++){
                        if(user_all[j].id == com_all[i].cuser){
                          com_all[i].authorname = user_all[j].nickname;
                        }
                      }
                    }
                    // for(var i = 0; i < com_all.length; i++){
                    //   com_all[i].authorname = user_all[com_all[i].cuser-1].nickname;
                    // }

                    for(var i = 0; i < com_all.length; i++){
                      var index = id_arr.indexOf(com_all[i].cstory);
                      if(index != -1){
                        ua[index].comment.push(com_all[i]);
                      }
                    }
                    // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
                    // console.log(ua[0].comment.length);               
                    // console.log(ua[0].comment);
                    
                    if(req.isAuthenticated()){
                      var U = req.user;
                      U.isVisitor = false;
                      U.isUser = true;
                      var dd = {
                        user: U,
                        ua: ua,
                        cat: "Love"
                       }
                    }else{
                      var U = {};
                      U.isVisitor = true;
                      U.isUser = false;
                      var dd = {
                        user: U,
                        ua: ua,
                        cat: "Love",
                        env: {
                         AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
                          AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
                          AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || global.cburl
                        }
                      }
                    }
                    res.render('temp_cat', dd);
                  }
                });               

              }
            });
          }
      });
    }
  );
}