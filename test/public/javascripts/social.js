var count = 0;
function social(n){
	// alert(n * n * n);
	// count += 1;
	// alert(count);
    // $(".btn").click(function(event) {
        // var id = event.target.id;
    var idstory = Math.floor(n / 6);
    var choice = n % 6;
    // console.log("id="+n);
    // console.log("ids="+idstory);
    // console.log("ch="+choice);
    switch(choice) {
		case 0:
    		addLike(idstory);
    		break;
		case 1:
    		addComment(idstory);
    		break;
    	case 2:
    		addShare(idstory);
    		break;	
		default:
			alert("Error!");
	}
    // });
}

function addLike(storyid){
	
	// if authenticated
		// find the story id
		// increment like by 1 in database
	// else
		// alert("You need to be logged in to comment or like a story.")

	// alert("like added!");
	var callback = function(body, status){
		if (status=="success"){
			// alert("length = " + body.record.length);
			var obj = body.record[0];
			var num = obj.num_likes;
			var mydata = JSON.stringify({
		        num_likes: num + 1
      		});

			$.ajax({
		    	type: "PUT",
    			url: URL,
    			contentType: "application/json",
    			data: mydata,
    			success: function(){
					document.getElementById(storyid*6).innerHTML = num + 1;    				
    			}
			});
		}else{
			console.log(status);
		}
	};	
	
	var URL = "http://ec2-52-6-13-67.compute-1.amazonaws.com:80/rest/ww1_sql/Story?app_name=ww1&ids=" + storyid;
	$.get(URL, callback);
}

function addComment(storyid){
	// alert("comment added!");
	if(document.getElementById(storyid*6+4).style.display == "none"){
		document.getElementById(storyid*6+4).style.display = "block";
	}else{
		document.getElementById(storyid*6+4).style.display = "none";
	}

	if(document.getElementById(storyid*6+3).style.display == "none"){
		document.getElementById(storyid*6+3).style.display = "block";
	}else{
		document.getElementById(storyid*6+3).style.display = "none";
	}
}

function commentSubmit(storyid, uid, nickname){
	var idstr = '#' + (storyid*6+5).toString();
    var mycom = $(idstr).val();

	var currentdate = new Date(); 
    var curr_datetime = currentdate.getFullYear() + "-" 
                      + (currentdate.getMonth()+1) + "-" 
                      + currentdate.getDate() + " "
                      + currentdate.getHours() + ":"  
                      + currentdate.getMinutes() + ":" 
                      + currentdate.getSeconds();
    // console.log(curr_datetime);

    var URL = "http://ec2-52-6-13-67.compute-1.amazonaws.com:80/rest/ww1_sql/Comment?app_name=ww1";
    var mydata = JSON.stringify({
    	cuser: uid,
    	time: curr_datetime,
        content: mycom,
        cstory: storyid        
	});

	$.ajax({
    	type: "POST",
		url: URL,
		contentType: "application/json",
		data: mydata,
		success: function(){
			// alert("success");
			var commentstr = "<li><p>by " + nickname + ", at " + curr_datetime + "</p>"
                        + "<p>" + mycom + "</p></li>";
		    $(commentstr).appendTo('#'+(storyid*6+3).toString());
			// document.getElementById(6*storyid+3).innerHTML = "<p>" + mycom + ", at " + curr_datetime + "</p>";
			var callback = function(body, status){
				if (status=="success"){
					// alert("length = " + body.record.length);
					var obj = body.record[0];
					var num = obj.num_comments;
					var mydata = JSON.stringify({
			        	num_comments: num + 1
	      			});

					$.ajax({
				    	type: "PUT",
		    			url: URL2,
		    			contentType: "application/json",
		    			data: mydata,
		    			success: function(){
							document.getElementById(storyid*6+1).innerHTML = num + 1;    				
	    				}
					});
				}else{
					console.log(status);
				}
			};	
			var URL2 = "http://ec2-52-6-13-67.compute-1.amazonaws.com:80/rest/ww1_sql/Story?app_name=ww1&ids=" + storyid;
			$.get(URL2, callback);
		}
	});

}

function addShare(storyid){
	// alert("shared!");

	// // trigger the sharing to facebook function
	// var facebook = "https://www.facebook.com/sharer/sharer.php?u=";

	// var defaults = {
	// 	url: document.location,
	// 	done_message: "Thanks!",
	// }

	// var the_url = '';
	// the_url = facebook + defaults.url + "#storyblock" + storyid;
	// alert(the_url);
	// var share_window = window.open(the_url, 'sharer', 'width=600,height=400,top=200,left=200');
	// var watchClose = setInterval(function() {
	//     try {
	//         if (share_window.closed) {
	//             clearTimeout(watchClose);
	//         }
	//     } catch (e) {}
	// }, 200);

	FB.ui({
	    method: 'share',
	    href: document.location + "#storyblock" + storyid,
	    // href: 'https://www.google.com',
	  },
	  // callback
	  function(response) {
	    if (response && !response.error_code) {
		// add the number of share to database, as well as display it
			var callback = function(body, status){
				if (status=="success"){
					// alert("length = " + body.record.length);
					var obj = body.record[0];
					var num = obj.num_shares;
					var mydata = JSON.stringify({
				        num_shares: num + 1
		      		});

					$.ajax({
				    	type: "PUT",
		    			url: URL,
		    			contentType: "application/json",
		    			data: mydata,
		    			success: function(){
							document.getElementById(storyid*6+2).innerHTML = num + 1;    				
		    			}
					});
				}else{
					console.log(status);
				}
			};	
			
			var URL = "http://ec2-52-6-13-67.compute-1.amazonaws.com:80/rest/ww1_sql/Story?app_name=ww1&ids=" + storyid;
			$.get(URL, callback);

		  	alert('Posting completed.');
	    } else {
		    alert('Error while posting.');
	    }
	  });
}