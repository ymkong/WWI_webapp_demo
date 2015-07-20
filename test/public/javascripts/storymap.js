function displayMap() {
	if(document.getElementById("map_canvas").style.display == "none"){
	    document.getElementById('map_canvas').style.display="block";
		initialize();
		document.getElementById("mymapbutton").innerHTML = "close map";		
	}else{
		document.getElementById("map_canvas").style.display = "none";
		document.getElementById("mymapbutton").innerHTML = "locate it on map";		
	}
}

function initialize() {
	var myOptions = {
	    zoom: 14,
	    center: new google.maps.LatLng(49.333, 5.0949),
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	  }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    google.maps.event.addListener(map, 'click', function(event) {
	    // var clickedLocation = {position: event.latLng, map: map};
	    var lat = event.latLng.lat(); 
	    var lng = event.latLng.lng();
	    $("#lat").val(lat);
	    $("#lng").val(lng);
  	});
}

