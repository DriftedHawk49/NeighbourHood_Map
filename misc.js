
var Zheader = new Headers();
Zheader.append("user-key","4c34b80cd92f9d38992e2d0def177a9d");
var map;
var centre = {
			lat: 28.614954,
			lng: 77.213139
	};
var initialArray = [];
var radius = 1000;
var markerArray = [];
var selectMarker;


class Restaurants{
	constructor(data){
		this.lat = data.location.latitude;
		this.lng = data.location.longitude;
		this.cuisine = data.cuisines,
		this.name = data.name,
		this.address = data.location.address,
		this.url = data.url;
		this.price_for_two = data.average_cost_for_two,
		this.online_delivery = data.has_online_delivery
	};

};

var getRequest = function(lat,lng,radius,start=0){
		var Zurl = `https://developers.zomato.com/api/v2.1/search?start=${start}&count=20&lat=${lat}&lon=${lng}&radius=${radius}&sort=real_distance&order=asc`;
		console.log(Zurl);
		fetch(Zurl,{
			headers : Zheader
		}).then(function(response){
			if(response.status<400){
				return response.json();
			}
			else{
				alert("An Error Occurred While Getting Your Request. Error Code : "+response.status);
			}
		 }).then(handleData).catch(function(er){
			alert("There Was a Problem Loading Your Request. Please Try Again Later.");
			console.log(er);
		});
};

var handleData = function(response){
		var data = response.restaurants;
		initialArray.length=0;
		console.log(initialArray);
		for(let rest of data){

			var restaurant = new Restaurants(rest.restaurant);
			var loc = {
				lat: restaurant.lat,
				lng: restaurant.lng
			};
			if(calculateDistance(centre,loc)<=radius){
				// console.log(calculateDistance(centre,loc));
				initialArray.push(restaurant);}

		}
		createMarkers();
	}
var calculateDistance = function(origin,destination){
	var start = new google.maps.LatLng(origin.lat,origin.lng);
	var stop = new google.maps.LatLng(destination.lat,destination.lng);
	return(google.maps.geometry.spherical.computeDistanceBetween(start,stop));
}



var createMarkers = function(){
	markerArray.length = 0;
	console.log(markerArray);
	if(initialArray.length===0){
		alert("No PLaces Found Within This Radius. Try Widening Your Search ");
	}
	else{
	for(let rest of initialArray){
		var pos = {
			lat: parseFloat(rest.lat),
			lng: parseFloat(rest.lng)
		};
		var marker = new google.maps.Marker({
			position: pos,
			map: map,
			animation: google.maps.Animation.DROP
		});

		markerArray.push(marker);
		}
	for(let mark of markerArray){
		mark.addListener('click',function(){
			if (mark.getAnimation() !== null) {
   	 			mark.setAnimation(null);
  			} else {
    		mark.setAnimation(google.maps.Animation.BOUNCE);
    		setTimeout(function(marker){
    			mark.setAnimation(null);
    		},1000,mark);
  			}
		});
	}
	}


}

var removeMarkers = function(){
	for(let marker of markerArray){
		marker.setMap(null);
	};
};

	var viewModel = function(){
	// console.log("yes");
	self = this;
	var slide = false;

	self.markerPosition = ko.observable();

	self.placeArray = ko.observableArray(initialArray);

	self.checkSlide = function() {
					if(slide===false){
				$(".sidebar").toggleClass("hidden");
				$(".sidebar").toggleClass("slideForward");
				setTimeout(function(){
					$("#text-containment").toggleClass("hidden");
					$(".sidebar").toggleClass("slideForward");
				},500);
				slide=true;
				}
				else{
					$("#text-containment").toggleClass("hidden");
					$(".sidebar").toggleClass("slideBackward");
					setTimeout(function(){
						$(".sidebar").toggleClass("hidden");
						$(".sidebar").toggleClass("slideBackward");
						// console.log("I'm Done");
						slide=false;
					},500);
				}
				}

}


ko.applyBindings(viewModel());


var initMap = function(){
	map = new google.maps.Map(document.getElementById('map'), {
          center: centre,
          zoom: 13
        });

	getRequest(centre.lat,centre.lng,radius);

	map.addListener('click',function(evt){
		let posi = {
			lat: evt.latLng.lat(),
			lng: evt.latLng.lng()
		};
		centre = posi;
		console.log(centre);
		console.log(posi);

		if(!selectMarker){
			selectMarker = new google.maps.Marker({
				position: posi,
				map: map,
				icon: "Asset_Files/Visual_Assets/myMarker.png",
				animation: google.maps.Animation.DROP
			});
		}
		else{
			selectMarker.setMap(null);
			selectMarker = new google.maps.Marker({
				position: posi,
				map: map,
				icon: "Asset_Files/Visual_Assets/myMarker.png",
				animation: google.maps.Animation.DROP
			});
		}
		removeMarkers();
		getRequest(posi.lat,posi.lng,radius);


	});
	console.log(placeArray());

}





