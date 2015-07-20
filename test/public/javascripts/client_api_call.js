

function submit_record(formSelector,statusReportor){
	var Arr_val=[];
	var Arr_cnt=0;

 	$.each($(formSelector).serializeArray(), function (i, field) {
 		var inputData=field.value;
         Arr_val.push(inputData.toUpperCase());
         Arr_cnt=Arr_cnt+1;
    });
      console.log(Arr_val);

   var name=Arr_val[0]+" "+Arr_val[1]+" "+Arr_val[2];


var url='http://ec2-52-6-13-67.compute-1.amazonaws.com/rest/ww1_sql/SoldierRecord?app_name=ww1';
var data={'record':[{
	"first_name": Arr_val[0],
	"middle_name": Arr_val[1],
	"last_name": Arr_val[2],
	"title": Arr_val[3],
	  "age": Arr_val[4],
	  "branch": Arr_val[5],
	  "hometown": Arr_val[6],
	 "page_link": Arr_val[7],
	  "gender": Arr_val[8],
}]};


var callback=function(body,status){
	console.log(status);
	if (status=="success"){
	var ids=body.idSoldier;
	console.log(ids);

	var query_str="<a href='/tellstories?character_id="+ids+"&first_name="+Arr_val[0]+"&last_name="+Arr_val[2]+"'>Success! Click here to tell a story about this person</a> Or <a href='/people'>refresh page to check result<a>";
	
	}else{
		var query_str="Failed!"+status;
	}
	document.getElementById(statusReportor).innerHTML=query_str;

};

$.post( url, data,callback);

}


function get_table(tableName,data){

var url='http://ec2-52-6-13-67.compute-1.amazonaws.com/rest/ww1_sql/'+tableName+'?app_name=ww1';
var callback=function(body,status){
	if (status=="success"){
		data(1,body.record);
	}else{
		data(0,null);
	}
};
	$.get(url,callback);
}

function get_story_by_ID(ID,callback){

	var url='http://ec2-52-6-13-67.compute-1.amazonaws.com:80/rest/ww1_sql/Story?app_name=ww1&ids='+ID;
	var callback_url=function(body,status){		
	//	console.log("check ID="+ID);
	//	console.log(body);
	//	console.log(status);
		if (status=="success"){
			var obj=body.record[0];
			var rec=[obj.title,obj.category,obj.num_likes,obj.num_shares,obj.num_comments,obj.content];
			callback(1,rec);
		}else{
			callback(0,null);
		}
	};
	if(ID==null)
		callback(0,null);
	else
		$.get(url,callback_url);
}


function generate_record_string(record){
		str="<tr>";		
		var name='';
		for (var j=1; j<4;j++){
			if (record[j]!=null)
				name=name+' '+record[j];
		}
		//console.log(record[10]);
		if (record[10]!='')
			str=str+'<td width="15%"><a href="'+record[10]+'">'+name+'</a></td>';
		else
			str=str+'<td width="15%">'+name+'</td>';
	
		for (var ind =4; ind <= 8; ind++)
				str=str+'<td width="15%">'+record[ind]+'</td>';

		str=str+'<td><div class="arrow"></div></td></tr>';
	//	console.log("String="+str);
	return str;
}

function generate_story_string(recStory,recSoi){

	var story_str='<tr><td colspan="5">';
	var image_path=recSoi[9];

	story_str=story_str+'<img src="'+image_path+'"'+ 'alt="No photo" height="122.6" width="102.4"/>';
	story_str=story_str+'<h4>Story</h4><ul>';

	$.each(recStory,function(ind,val){
		if (ind==0)
			story_str=story_str+'<li class="inbetween2">Title: '+val+'</li>';
		else if (ind==1)
			story_str=story_str+'<li class="inbetween2">Category: '+val+'</li>';
		else if (ind==2)
			story_str=story_str+'<li class="inbetween2">Likes: '+val+'</li>';
		else if (ind==3)
			story_str=story_str+'<li class="inbetween2">Shares: '+val+'</li>';
		else if (ind==4)
			story_str=story_str+'<li class="inbetween2">Comments: '+val+'</li>';
		else if(ind==5)
			story_str=story_str+'<li class="inbetween2">Content: '+val+'</li>';
	});
	story_str=story_str+'</ul></td></tr>';
	//console.log(story_str);
	return story_str;

}


function get_soldierRecord_by_key(key,val,data){
	
	var url='http://ec2-52-6-13-67.compute-1.amazonaws.com/rest/ww1_sql/SoldierRecord?app_name=ww1&'+'filter='+key+'="'+val+'"';
	
	var url_callback=function(body,status){
	
		var obj=body.record[0];
		var result=[];

	//	console.log(status+'@:'+key+","+val+obj);
		if (obj!=undefined){
			//console.log(body);
			body.record.length=1;

			// for (var i =0; i <body.record.length; i++) {
			// 	var obj=body.record[i];
			// 	var rec=[obj.idSoldier,obj.first_name,obj.middle_name,obj.last_name,obj.hometown,obj.title,obj.branch,obj.gender,obj.age,obj.image_path,obj.page_link,obj.story_id];					
			// 	result[i]=rec;
			// };
			var obj=body.record[0];
			var rec=[obj.idSoldier,obj.first_name,obj.middle_name,obj.last_name,obj.hometown,obj.title,obj.branch,obj.gender,obj.age,obj.image_path,obj.page_link,obj.story_id];					
			result=rec;
									//consol			
			data(1,result);
			console.log(rec);
			//console.log(rec.length);
		}else{
			data(0,[]);
		}	

	}

	if (val=='')
		data(0,'');
	else
		$.get(url,url_callback);
}


function talble_motion(displaySelector){
	 setTimeout(function(){
	 	
	 //	console.log($("#"+displaySelector+" tr").length);
        $("#"+displaySelector+" tr:odd").addClass("odd");
       // console.log("add odd class");
       // setTimeout(function(){
        		$("#"+displaySelector+" tr:not(.odd)").hide();  		
        	//	setTimeout(function(){
                $("#"+displaySelector+" tr:first-child").show();  
             	console.log("Fishing detecting event");        
       			$("#"+displaySelector+" tr.odd").click(function(){
           		$(this).next("tr").toggle();
           		$(this).find(".arrow").toggleClass("up");
  				 });
        	//},10);
       // },10);
    },500);
}


function search_record(formSelector,displaySelector){

	$("#"+displaySelector).find("tr:gt(0)").remove();
	console.log("clear table");
	var Arr_val=[];
	var Arr_cnt=0;

 	$.each($(formSelector).serializeArray(), function (i, field) {
 		var inputData=field.value;
         Arr_val.push(inputData.toUpperCase());
         Arr_cnt=Arr_cnt+1;
    });

    Arr_val.push($( "#myselect" ).val());

    console.log(Arr_val);


	// var rec=[];
	var rec_cnt=0;
	var rec_id=[];

	// var story_rec=[];
	var story_cnt=0;

	var key1='first_name';
	var val1=Arr_val[0];

	var str='';
	var story_str='';


	var callback1=function (status1,data1){
    		//console.log("Check"+"KEY="+key1+"VAL="+val1);
			if (status1>0){

			// 	for (var i =0; i<status1; i++) {
			// 		rec_cnt++;

			// //	console.log("find record @ key="+key1);		
			// 	var str=generate_record_string(data1[i]);
			// 	rec_id.push(data1[i][0]);

			// 	var story_id=data1[i][11];
			// 	var story_callback=function(status,data){
			// 		story_cnt++;
			// 		if (status==1)
			// 			story_str=generate_story_string(data,data1[i]);
			// 		else
			// 			story_str='<tr><td colspan="5"><h4>No related story<h4></td></tr>';
			// 	//	console.log(data);
			// 		//console.log(data1);
			// 		$("#"+displaySelector+" tr:last").after(str);	
			// 		$("#"+displaySelector+" tr:last").after(story_str);

			// 		console.log("Finish table display@1");
			// 	};
			// 	get_story_by_ID(story_id,story_callback);
			// 	};
				rec_cnt++;
				// rec[rec_cnt]=data1;
				
			//	console.log("find record @ key="+key1);		
				str=generate_record_string(data1);
				rec_id.push(data1[0]);

				var story_id=data1[11];
				var story_callback=function(status,data){

					story_cnt++;
					if (status==1)
						story_str=generate_story_string(data,data1);
					else
						story_str='<tr><td colspan="5"><h4>No related story<h4></td></tr>';
				//	console.log(data);
					//console.log(data1);
					$("#"+displaySelector+" tr:last").after(str);	
					$("#"+displaySelector+" tr:last").after(story_str);

					console.log("Finish table display@1");
				};
				get_story_by_ID(story_id,story_callback);



			}else
				rec_id.push(0);

			//console.log(status1,data1);

			var key2='last_name';
			var val2=Arr_val[1]; 

			var callback2=function(status2,data2){
    		//	console.log("Check"+"KEY="+key2+"VAL="+val2);
				if (status2==1){
					// rec[rec_cnt]=data2;
					if (rec_id[0]!=data2[0]){
						var str2=generate_record_string(data2);

						rec_id.push(data2[0]);
						var story_id=data2[11];
						rec_cnt++;

						var story_callback=function(status,data){
							// story_rec[story_cnt]=data;
							story_cnt++;
							if (status==1)
								var story_str2=generate_story_string(data,data2);
							else
								var story_str2='<tr><td colspan="5"><h4>No related story<h4></td></tr>';

							$("#"+displaySelector+" tr:last").after(str2);	
							$("#"+displaySelector+" tr:last").after(story_str2);
							console.log("Finish table display2");
						};
						get_story_by_ID(story_id,story_callback);
					}else
						rec_id.push(0);

				//	console.log("find record @ key="+key2);			
				}
			//	console.log(status2,data2);
				var key3='hometown';
				var val3=Arr_val[2]; 
				var callback3=function(status3,data3){
					// console.log("Check"+"KEY="+key3+"VAL="+val3);
					if (status3==1){

						if ((data3[0]!=rec_id[0])&&(data3[0]!=rec_id[1])){
							// rec[rec_cnt]=data3;
							var str3=generate_record_string(data3);

							rec_id.push(data3[0]);
							var story_id=data3[11];
							rec_cnt++;
							var story_callback=function(status,data){
							
								story_cnt++;
								if (status==1)
									var story_str3=generate_story_string(data,data3);
								else
									var story_str3='<tr><td colspan="5"><h4>No related story<h4></td></tr>';


									$("#"+displaySelector+" tr:last").after(str3);	
									$("#"+displaySelector+" tr:last").after(story_str3);
    		
								
								console.log("Finish table display@3");
							};						
							get_story_by_ID(story_id,story_callback);
						}else
							rec_id.push(0);


					}
					//console.log(status3,data3);
				//	console.log("# or Records found:"+story_cnt+rec_cnt);
					document.getElementById("report_status").innerHTML="Found "+rec_cnt+" related records";

					talble_motion(displaySelector);
				};
				get_soldierRecord_by_key(key3,val3,callback3);
			};
			get_soldierRecord_by_key(key2,val2,callback2);
		};

	get_soldierRecord_by_key(key1,val1,callback1);

}