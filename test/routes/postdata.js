var request = require('request');

module.exports = function(app) {
  app.post('/postdata', function(req, res) {
    // if (req.isAuthenticated()){
    //     var data = JSON.stringify({
    //       author: req.user.nickname,
    //       title: req.body.title,
    //       content: req.body.comment,
	   //      date: new Date().toDateString()
    //     });
    //   }else{
    //     var data = JSON.stringify({
    //       title: req.body.title,
    //       content: req.body.comment,
    //       date: new Date().toDateString()
    //     });
    //  }

      // var data = JSON.stringify({
      // username: req.body.title,
      // password: req.body.comment
      // });
    var currentdate = new Date(); 
    var curr_datetime = currentdate.getFullYear() + "-" 
                      + (currentdate.getMonth()+1) + "-" 
                      + currentdate.getDate() + " "
                      + currentdate.getHours() + ":"  
                      + currentdate.getMinutes() + ":" 
                      + currentdate.getSeconds();
    console.log(curr_datetime);

    var data = JSON.stringify({
      title: req.body.title,
      authorID: req.user._json.ww1_id,
      datetime: curr_datetime,
      content: req.body.comment,
      category: req.body.category,
      lat: req.body.lat,
      lng: req.body.lng,
      character_id: parseInt(req.body.cid)
    });

    var is_about_people = req.body.aboutp;
    var char_id = parseInt(req.body.cid);
    console.log("***************char_id**************");
    console.log(char_id);
      // console.log("hello!");
      // console.log(req.body.lat)
      // console.log(req.body.lng);      

    request(
      {url: 'http://ec2-52-6-13-67.compute-1.amazonaws.com/rest/ww1_sql/Story?app_name=ww1',
      method: 'POST',
      header: {'Content-Type': 'application/json'},
      body: data}, 
      function(error, response, body){
          if(error){
            console.log(error);
          }
          else{
            console.log(response.statusCode);
            console.log("success");
            console.log("*************************************");
            console.log(response.body);
            if(is_about_people){
              var returned_story_id = JSON.parse(response.body)['idStory'];
              console.log("=========================================");
              console.log(returned_story_id);
              var mydata = JSON.stringify({
                story_id: returned_story_id
              });

              request({url: 'http://ec2-52-6-13-67.compute-1.amazonaws.com/rest/ww1_sql/SoldierRecord?app_name=ww1&ids=' + char_id,
                      method: 'PUT',
                      header: {'Content-Type': 'application/json'},
                      body: mydata}, 
                      function(error, response, body){
                        if(error){
                          console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%");
                          console.log(error);
                        }
                        else{
                          console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%");
                          console.log("insert to SoldierRecord success");
                          console.log(response.body);
                        }
                      });
            }
          }
      }
    );
    res.redirect("/");
  });
}
