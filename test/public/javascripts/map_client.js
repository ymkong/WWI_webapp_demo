//http://52.5.222.157/9000

var middle = new google.maps.LatLng(49.333, 5.0949);
var markers = [];  
var markerObjects = [];
var bounds;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var start;
var end;
var map;
var infowindow;
var waypoints = [];
var pageInfo = [];
var numWaypoints = 0;
var body;
var addWaypointButton;
var delWaypointButton;
var saveTour;
var tourToDB;
var placeNames;
function initialize() {
  
  jQuery.ajaxSetup({async:false});

  pullDBInfo("Place");
  addStoryMarkers();
  directionsDisplay = new google.maps.DirectionsRenderer();
  
  var mapOptions = {
    center: { lat: 49.333, lng: 5.0949},
    zoom: 16,
    draggable: true,
    panControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL,
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    }
  };
  
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  
  infowindow = new google.maps.InfoWindow({
      content: "test",
      maxWidth: 200
  });
  
  google.maps.event.addListener(map, 'click', function(event) {
    var clickedLocation = {position: event.latLng, map: map};
    infowindow.open(map, this);
    infowindow.setContent("<a href=/tellstories?lat=" + event.latLng.lat() + "&lng=" + event.latLng.lng() + ">Tell Your Story</a>");
    infowindow.setPosition(clickedLocation.position);
  });
 
  
  //add markers
  for( i = 0; i < markers.length; i++ ) {
    var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
    var icon;
    if(markers[i][5] === 'bathroom') icon = '/public/images/bathroom.png';
    else if (markers[i][5] === 'food') icon = '/public/images/food.png';
    else if(markers[i][3] === 'historical') icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    else if(markers[i][3] === 'user') icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';

    markerObjects[i] = new google.maps.Marker({
	position: position,
	map: map,
	title: markers[i][0],
	category:markers[i][3],
	visible: true,
	icon: icon,
	content: markers[i][4],
	ref: markers[i][5],
	image: markers[i][6]
    }); 
    google.maps.event.addListener(markerObjects[i], 'click', function() {
      infowindow.close();
      if(this.ref.toLowerCase() === "bathroom" || this.ref.toLowerCase() === "food") infowindow.setContent(this.ref);
      else if(this.category === 'historical') infowindow.setContent("<div id=content class=comment><a href=/places2see?pl=" + this.ref + ">" + this.title + "<a></a></br></br><img src = /public/images/pics/" + this.image + " width=200px></img></br></br><p1>" + this.content + "<p1></p1></div>");
      else if(this.category == 'user')infowindow.setContent("<div id=content class=comment><a>" + this.title + "<a></a></br></br><p1>" + this.content + "<p1></p1></div>");
      infowindow.open(map, this);
      $(".comment").shorten();
      if(end == null) document.getElementById("pac-input-source").value = this.title;
    });
  }
  
    // Create the search box and link it to the UI element.
  var inputSource = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input-source'));
  addWaypointButton = document.getElementById('add-point');
  delWaypointButton = document.getElementById('del-point');

  saveTour = document.getElementById("save-tour");

if(document.getElementById("userID").value === "") saveTour.style.display='none';
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(inputSource);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(addWaypointButton);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(delWaypointButton);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(saveTour);  
  
  calcRoute();
  directionsDisplay.setMap(map);
}

function saveCustomTour(){
 var tour = [];
 for(var j = 0; j < markers.length; j++){
  if(markers[j][1].toFixed(5) == start.lat().toFixed(5) && markers[j][2].toFixed(5) == start.lng().toFixed(5)) tour.push(markers[j][0]);
  
  }
  for(var k = 0; k < markers.length; k++){
    for(var i = 0; i < waypoints.length; i++){
      if(markers[k][1].toFixed(5) == waypoints[i].location.lat().toFixed(5) && markers[k][2].toFixed(5) == waypoints[i].location.lng().toFixed(5)) tour.push(markers[k][0]);
    }
  }
  for(var m = 0; m < markers.length; m++){
      if(markers[m][1].toFixed(5) == end.lat().toFixed(5) && markers[m][2].toFixed(5) == end.lng().toFixed(5)) tour.push(markers[m][0]); 
  }
  for(var n = 0; n <= tour.length; n++){
      if(tour[n] == tour[n+1]) tour.splice(n+1, 1);
  }
  for(var n = 0; n <= tour.length; n++){
      if(tour[n] == tour[n+1]) tour.splice(n+1, 1);
  }
  tourToDB = tour[0] + '?';
  for(var p = 1; p < tour.length-1; p++)
  {
    tourToDB += tour[p];
    tourToDB += '?';
  }
  tourToDB += tour[tour.length-1];
 var data = {"route":tourToDB};
  var userID = document.getElementById("userID").value;

 $.ajax({
   type: "PUT",
   url: "http://ec2-52-6-13-67.compute-1.amazonaws.com:80/rest/ww1_sql/User?app_name=ww1&ids=" + userID,
   contentType: "application/json",
   data: JSON.stringify(data)
 });
}

function calcRoute() {
  directionsDisplay.setMap(map);
 // getWaypoints();
  
  if(start != null){
    
    var request = {
	origin:start,
	destination: end,
	waypoints: waypoints,
	optimizeWaypoints: true,
	travelMode: google.maps.TravelMode.WALKING
    };
    
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
	directionsDisplay.setDirections(response);
      }
    });
    
  }
}


function findPlace(){
  //getWaypoints();
  directionsDisplay.setMap(map);
  var source = document.getElementById('pac-input-source').value.toLowerCase();
  
  for(var i = 0; i < markers.length; i++)
  {
    if(source === markers[i][0].toLowerCase()){
     start = new google.maps.LatLng(markers[i][1], markers[i][2]);
     infowindow.close();
     if(markers[i][5].toLowerCase() === 'bathroom' || markers[i][5].toLowerCase() === 'food') infowindow.setContent(markers[i][5]);
     else if(markers[i][3] === 'historical') infowindow.setContent("<div id=content class=comment><a href=/places2see?pl=" + markers[i][5] + ">" + markerObjects[i].title + "<a></a></br></br><img src = /public/images/pics/" + markerObjects[i].image + " width=200px></img></br></br><p1>" + markers[i][4] + "<p1></p1></div>"); 
     else if(markers[i][3] == 'user') infowindow.setContent("<div id=content class=comment><a>" + markerObjects[i].title + "<a></a></br></br><p1>" + markers[i][4] + "<p1></p1></div>");

      if(end == null) document.getElementById("pac-input-source").value = markerObjects[i].title;
      $(".comment").shorten();
     infowindow.open(map, markerObjects[i]);
    }
  }
}

function addWaypoint(){
  var curr = document.getElementById('waypoint'+(numWaypoints-1).toString());
//console.log('waypoint'+(numWaypoints).toString());
  //if((curr != null && curr.value.length > 0) || (start != null && numWaypoints == 0)){
  numWaypoints++;
  var newPoint = document.createElement("input");
  newPoint.type = "text";
  newPoint.setAttribute('onkeydown', 'getWaypoints()');
  
  if(end == null && numWaypoints == 1) newPoint.setAttribute('id', "end");
  else{
    newPoint.setAttribute('id', 'waypoint'+(numWaypoints-2).toString());  
  }
  
  map.controls[google.maps.ControlPosition.LEFT_TOP].pop(addWaypointButton);
  map.controls[google.maps.ControlPosition.LEFT_TOP].pop(delWaypointButton);
  map.controls[google.maps.ControlPosition.LEFT_TOP].pop(saveTour);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(newPoint);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(addWaypointButton);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(delWaypointButton);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(saveTour);
//}
}

function getWaypoints(){ 
  var startNull = document.getElementById("pac-input-source");  
  if(startNull != null){
   for(var k = 0; k < markers.length; k++)
   {
    if(markers[k][0].toLowerCase() === document.getElementById("pac-input-source").value.toLowerCase()) start = new google.maps.LatLng(markers[k][1], markers[k][2]); 
   }
  }
  var endNull = document.getElementById("end");
  if(endNull != null){
   for(var k = 0; k < markers.length; k++)
   {
    if(markers[k][0].toLowerCase() === document.getElementById("end").value.toLowerCase()) end = new google.maps.LatLng(markers[k][1], markers[k][2]); 
   }
  }
  if(end != null && start != null){
    for(var i = 0; i < numWaypoints; i++)
    {
      var pointNull = document.getElementById("waypoint"+i.toString());
      if(pointNull != null){
          var locName = document.getElementById("waypoint"+i.toString()).value;
          for(var j = 0; j < markers.length; j++)
          {
	        if(markers[j][0].toLowerCase() === locName.toLowerCase()) waypoints[i] = ({location: new google.maps.LatLng(markers[j][1], markers[j][2])});
          }
        }
    }
}
  calcRoute();
}

function pullDBInfo(tableName){
  placeNames = ["moh1", "moh2", "moh3", "moh4", "moh5", "moh6","moh7", "moh8", "moh9", "gravesite", "chapel", "gravesite", "lostbattalion", "montfaucon", "visitor", "bathroom", "food"];
  jQuery.ajaxSetup({async:false});
  for(var i = 0; i < placeNames.length; i++){
    $.get("/public/json/" + placeNames[i] + ".json", function (body){
      markers.push([body.name, body.coordinates[0], body.coordinates[1], 'historical', body.description, placeNames[i], body.image]);
    });
  }
  $.get("http://ec2-52-6-13-67.compute-1.amazonaws.com/rest/ww1_sql/Story?app_name=ww1", addStoryMarkers);
}

function removeWaypoint(){
  
  if(waypoints.length == 0){
    document.getElementById("end").remove();
    end = null;
    directionsDisplay.setMap(null);
  }
  else{
    waypoints.pop();
    var name = 'waypoint'+(numWaypoints-2).toString();
    document.getElementById(name).remove();
    calcRoute();
  }
  
  map.controls[google.maps.ControlPosition.LEFT_TOP].pop(addWaypointButton);
  map.controls[google.maps.ControlPosition.LEFT_TOP].pop(delWaypointButton);
  map.controls[google.maps.ControlPosition.LEFT_TOP].pop(saveTour);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(addWaypointButton);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(delWaypointButton);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(saveTour);
  numWaypoints--;
}

function addStoryMarkers(body){
  jQuery.ajaxSetup({async:false});
  if(body != null){
    for(var i = 0; i < body.record.length; i++)
    {
      var temp = body.record[i];
      if(temp.lat != 0 && temp.lng != 0) markers.push([temp.title, temp.lat, temp.lng, 'user', temp.content, "-1", "-1"]);
    }
  }
}

google.maps.event.addDomListener(window, 'load', initialize);
