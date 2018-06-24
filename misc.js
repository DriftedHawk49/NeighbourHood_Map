
var Zheader = new Headers();
Zheader.append("user-key","4c34b80cd92f9d38992e2d0def177a9d");
var map;
var centre = {
			lat: 28.614954,
			lng: 77.213139
	};
var placeArrayCopy = [];
var radius = 1000;
var markerArray = [];
var selectMarker;
var infoWindowArray = [];
var activeInfoWindow;



var viewModel = function(){
	// console.log("yes");
	self = this;
	var slide = false;

	self.markerPosition = ko.observable();
	self.resultCounter = ko.observable();
	self.placeArray = ko.observableArray();

	self.checkSlide = function() {
					if(slide===false){
				$(".sidebar").toggleClass("hidden");
				$(".sidebar").toggleClass("slideForward");
				setTimeout(function(){
					$("#text-containment").toggleClass("hidden");
					$(".sidebar").toggleClass("slideForward");
				},200);
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
					},200);
				}
				}
	self.maxPrice = ko.observable();
	self.nameString = ko.observable();
	self.onlineDelivery = ko.observable("null");
	self.filterOut = function(){
		if(maxPrice()!=undefined||nameString()!=undefined||onlineDelivery()!="null"){
			var altArray = [];
			if(nameString()!=undefined&&maxPrice()==undefined&&onlineDelivery()=='null'){
				for(let rest of placeArray()){
					var originalString = rest.name.toLowerCase();
					var searchstring = nameString().toLowerCase();
					console.log(originalString);
					console.log(searchstring);
					if(originalString.includes(searchstring)){
						altArray.push(rest);
					}
					else{
						rest.marker.setMap(null);
					}
				}
			}
			else if(maxPrice()!=undefined&&nameString()==undefined&&onlineDelivery()=='null'){
				for(let rest of placeArray()){
					if(rest.price_for_two<=maxPrice()){
						altArray.push(rest);
					}
					else{
						rest.marker.setMap(null);
					}
				}
			}
			else if(onlineDelivery()!='null'&&maxPrice()==undefined&&nameString()==undefined){

					if(onlineDelivery()=='true'){
						for(let rest of placeArray()){
							if(rest.online_delivery>0){
								altArray.push(rest);
							}
							else{
								rest.marker.setMap(null);
							}
						}
					}else{
						for(let rest of placeArray()){
							if(rest.online_delivery==0){
								altArray.push(rest);
							}
							else{
								rest.marker.setMap(null);
							}
						}
					}
			}
			else if(nameString()!=undefined&&maxPrice()!=undefined&&onlineDelivery()=='null'){
				for(let rest of placeArray()){
					// INSERT REFERENCES
					var originalString = rest.name.toLowerCase();
					var searchstring = nameString().toLowerCase();
					if(originalString.includes(searchstring)&&rest.price_for_two<=maxPrice()){
						altArray.push(rest);
					}
					else{
						rest.marker.setMap(null);
					}
				}
			}
			else if(nameString()!=undefined&&maxPrice()==undefined&&onlineDelivery()!='null'){

				if(onlineDelivery()=='true'){
						for(let rest of placeArray()){
							// INSERT
							var originalString = rest.name.toLowerCase();
							var searchstring = nameString().toLowerCase();
							if(originalString.includes(searchstring)&&rest.online_delivery>0){
								altArray.push(rest);
							}
							else{
								rest.marker.setMap(null);
							}
						}
					}else{
						for(let rest of placeArray()){
							// INSERT
							var originalString = rest.name.toLowerCase();
							var searchstring = nameString().toLowerCase();
							if(originalString.includes(searchstring)&&rest.online_delivery==0){
								altArray.push(rest);
							}
							else{
								rest.marker.setMap(null);
							}
						}
					}
			}
			else if(nameString()==undefined&&maxPrice()!=undefined&&onlineDelivery()!='null'){

				if(onlineDelivery()=='true'){
						for(let rest of placeArray()){
							if(rest.price_for_two<=maxPrice()&&rest.online_delivery>0){
								altArray.push(rest);
							}
							else{
								rest.marker.setMap(null);
							}
						}
					}else{
						for(let rest of placeArray()){
							if(rest.price_for_two<=maxPrice()&&rest.online_delivery==0){
								altArray.push(rest);
							}
							else{
								rest.marker.setMap(null);
							}
						}
					}

			}
			else{
				if(onlineDelivery()=='true'){
						for(let rest of placeArray()){
							// INSERT
							var originalString = rest.name.toLowerCase();
							var searchstring = nameString().toLowerCase();
							if(originalString.includes(searchstring)&&rest.online_delivery>0&&rest.price_for_two<=maxPrice()){
								altArray.push(rest);
							}
							else{
								rest.marker.setMap(null);
							}
						}
					}else{
						for(let rest of placeArray()){
							// INSERT
							var originalString = rest.name.toLowerCase();
							var searchstring = nameString().toLowerCase();
							if(originalString.includes(searchstring)&&rest.online_delivery==0&&rest.price_for_two<=maxPrice()){
								altArray.push(rest);
							}
							else{
								rest.marker.setMap(null);
							}
						}
					}


			}
			placeArray([]);
			placeArray(altArray);
			console.log(placeArray());
			resultCounter(placeArray().length);
			assignClick();
		}
		else{
			alert(" No Filters Are Selected. Please Try With Filters Applied.");
		}

	}

	self.resetFilters = function(){
		if(placeArrayCopy.length===0){
			alert("No Filters Are Applied. Use Reset After Applying Filters.");
		}
		else{
			placeArray([]);
			placeArray(placeArrayCopy);
			for(var rest of placeArray()){
				rest.marker.setMap(map);
			}
			resultCounter(placeArray().length);
		}
	}

}
// End of ViewModel

ko.applyBindings(viewModel);
setInterval(function(){
	console.log(placeArrayCopy);
},5000)


class Restaurants{
	constructor(data){
		this.lat = data.location.latitude;
		this.lng = data.location.longitude;
		this.cuisine = data.cuisines,
		this.name = data.name,
		this.address = data.location.address,
		this.url = data.url;
		this.price_for_two = data.average_cost_for_two,
		this.online_delivery = data.has_online_delivery,
		this.marker,
		this.infowindow
	};

};

var getRequest = function(lat,lng,radius,start=0){
		var Zurl = `https://developers.zomato.com/api/v2.1/search?start=${start}&count=20&lat=${lat}&lon=${lng}&radius=${radius}&sort=real_distance&order=asc`;
		// console.log(Zurl);
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
			alert("There Was a Problem Loading Your Request.");
			console.log(er);
		});
};

var handleData = function(response){
		var data = response.restaurants;
		placeArray([]);
		placeArrayCopy.length=0;

		for(let rest of data){

			var restaurant = new Restaurants(rest.restaurant);
			var loc = {
				lat: restaurant.lat,
				lng: restaurant.lng
			};
			if(calculateDistance(centre,loc)<=radius){
				placeArrayCopy.push(restaurant);
				placeArray.push(restaurant);}

		}
		resultCounter(placeArray().length);
		setInfoWindows();
		createMarkers();
		assignInfoToMarkers();
	}




var calculateDistance = function(origin,destination){
	var start = new google.maps.LatLng(origin.lat,origin.lng);
	var stop = new google.maps.LatLng(destination.lat,destination.lng);
	return(google.maps.geometry.spherical.computeDistanceBetween(start,stop));
}



var createMarkers = function(){
	markerArray.length = 0;
	if(placeArray().length===0){
		alert("No PLaces Found Within This Radius. Try Widening Your Search ");
	}
	else{
	for(let rest of placeArray()){
		// console.log(rest);
		var pos = {
			lat: parseFloat(rest.lat),
			lng: parseFloat(rest.lng)
		};
		var marker = new google.maps.Marker({
			position: pos,
			map: map,
			animation: google.maps.Animation.DROP
		});
		rest.marker = marker;
		}
	}
}


var assignInfoToMarkers = function(){
	for(let rest of placeArray()){
		rest.marker.addListener('click',function(){
			addInfoWindow(rest.infowindow,rest.marker);
			toggleBounce(rest.marker);
		});
		}
}


var addInfoWindow = function(infoObj,marker){
	if(activeInfoWindow){activeInfoWindow.close();}
	infoObj.open(map,marker);
	activeInfoWindow = infoObj;
};


var toggleBounce = function(marker){
	if (marker.getAnimation() !== null) {
   	 			marker.setAnimation(null);
  			}
  			else {
    		marker.setAnimation(google.maps.Animation.BOUNCE);
    		setTimeout(function(marker){
    			marker.setAnimation(null);
    		},1000,marker);
  			}
};


var removeMarkers = function(){
	for(let rest of placeArray()){
		rest.marker.setMap(null);
	};
};


var setInfoWindows = function(){
	infoWindowArray.length = 0;
		for(let resto of placeArray()){
			var del;
			if(resto.online_delivery===0){
				del = "Not Available";
			} else {
				del = "Available";
			}
			var infowindow = new google.maps.InfoWindow({
				content : `<div class="info-div"><h2 class="info-head">${resto.name}</h2><ul class="info-list"><li><a href="${resto.url}">Visit Page</a></li><li><b>CUISINE :</b> ${resto.cuisine} </li><li><b>Address :</b>${resto.address} </li><li><b>Cost For 2 :</b> Rs. ${resto.price_for_two}</li><li> <b>Online Delivery : </b>${del} </li></ul></div>`
			});
			resto.infowindow = infowindow;
		}
		assignClick();
};


var assignClick = function(){

		$(".side-list").on('click',function(arg){
			var targetName = arg.target.innerText;
			for(let rest of placeArray()){
				if(rest.name ===targetName){
					toggleBounce(rest.marker);
					addInfoWindow(rest.infowindow,rest.marker);
				}
			}
		});
}



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
		// console.log(centre);
		// console.log(posi);

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


}





