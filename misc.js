
var Zheader = new Headers();																			// Initialising Header For Including The API Key For Zomato API
Zheader.append("user-key","4c34b80cd92f9d38992e2d0def177a9d");											// Appended the API key to Header to fetch GET requests.
var map;																								// Variable to contain our map Object
var centre = {																							// Dfault Centre Initialisation
			lat: 28.614954,																				// lat means Latitude
			lng: 77.213139																				// lng means longitutde
	};
var placeArrayCopy = [];																				// Array to contain a Copy of all the restaurent objects, used in resetting the filters
var radius = 1000;																						// Radius for search , default value is 1km. For optimisation purposes , it cannot be changed by user.
var selectMarker;																						// Variable which will contain marker issued by user's click on map.
var activeInfoWindow;																					// Variable to contain the active info Window , to implement a feature where only 1 infoWindow is open at a time.
var slide = false;																						// Variable to keep track of sliding animation of the Filter Menu.

//This is Our viewModel which will contain variables which will update the UI(HTML) Automatically. No javascript updation is used.
// FrameWork used - knockoutJS


var viewModel = function(){
	self = this;																						// Assigning the parent context to self variable so , that this variable is not confused inside the functions.
	self.resultCounter = ko.observable();																// This keeps track of how many results are found , and updates the UI automatically.
	self.placeArray = ko.observableArray();																// This Observable Array keeps track of the All the restaurents to be placed in the sliding filter menu. THis Popultes the li element automatically depending uponwhat it contains
	self.maxPrice = ko.observable();																	// This keeps track of the input tag where it asks for maximum price for 2 to add as a filter. its value gets updated automatically according to the user input , as soon as user inputs it.
	self.nameString = ko.observable();																	// This keeps track of the name entered in the input tag to use as name filter its value gets updated automatically according to the user input , as soon as user inputs it.
	self.onlineDelivery = ko.observable("null");														// This keeps track of the radio button value , for online delivery status, to use as a filter its value gets updated automatically according to the user input , as soon as user inputs it.

	self.checkSlide = function() {																		// This function is bound to top left menu toggle button , which operates to show/hide menu & add/remove necessary animation.this function is associated with a tag in UI by knockoutJS binding feature.
					if(slide===false){																	// check if the slide is false , means menu is hidden.
				$(".sidebar").toggleClass("hidden");													// show the menu
				$(".sidebar").toggleClass("slideForward");												// Do the animation of sliding.
				setTimeout(function(){
					$("#text-containment").toggleClass("hidden");										// After animation is finished , display all the text inside.
					$(".sidebar").toggleClass("slideForward");											// remove the animation class from sidebar.
				},200);
				slide=true;																				// Turn slide to true , which means now the menu is visible.
				}
				else{																					// If the menu was already visible , on click of top left button :
					$("#text-containment").toggleClass("hidden");										// Hide all the text inside the menu first.
					$(".sidebar").toggleClass("slideBackward");											// Initiate the animation on the side bar , of sliding back.
					setTimeout(function(){
						$(".sidebar").toggleClass("hidden");											// After the animation is finished, hide the side bar
						$(".sidebar").toggleClass("slideBackward");										// Remove the animation class.
						slide=false;
					},200);
				}
				}

	self.filterOut = function(){																		// Function to Initiate All filters , this function is associated with Filter Button in UI by knockoutJS binding feature.
		if(maxPrice()!=undefined||nameString()!=undefined||onlineDelivery()!="null"){					// There are total 8 cases, beacsue of 3 filters, different permutations of filters to be applied. this first if condition eliminates the case when no filter is applied and user just clicks on the filter button.
			var altArray = [];																			// An Alternate array to store all the filtered results.
			if(nameString()!=undefined&&maxPrice()==undefined&&onlineDelivery()=='null'){				// Case : When It is a name filter ONLY
				for(let rest of placeArray()){															// This loops over all the restaurents in placesArray and checks if the search string is the substring of the name of the restaurent.
					var originalString = rest.name.toLowerCase();										// This returns the lowercase of the name string , so that the search is case insensitive.
					var searchstring = nameString().toLowerCase();										// This returns the lowercase of the search string , so that the search is case insensitive.
					if(originalString.includes(searchstring)){											// This checks for the presence of search string in the name string
						altArray.push(rest);															// For all the matched results, push that object in altArray array.
					}
					else{
						rest.marker.setMap(null);														// if unmatched then remove its marker from the map.
					}
				}
			}
			else if(maxPrice()!=undefined&&nameString()==undefined&&onlineDelivery()=='null'){			// Case : When it is maximum price filter ONLY
				for(let rest of placeArray()){															// All the processes further can be understood according to above explained process , in respective analogy.
					if(rest.price_for_two<=maxPrice()){
						altArray.push(rest);
					}
					else{
						rest.marker.setMap(null);
					}
				}
			}
			else if(onlineDelivery()!='null'&&maxPrice()==undefined&&nameString()==undefined){			// Case : When it is Online delivery status filter ONLY

					if(onlineDelivery()=='true'){														// If the online delivery filter is true,
						for(let rest of placeArray()){
							if(rest.online_delivery>0){
								altArray.push(rest);
							}
							else{
								rest.marker.setMap(null);
							}
						}
					}else{
						for(let rest of placeArray()){													// If the online delivery filter is false.
							if(rest.online_delivery==0){
								altArray.push(rest);
							}
							else{
								rest.marker.setMap(null);
							}
						}
					}
			}
			else if(nameString()!=undefined&&maxPrice()!=undefined&&onlineDelivery()=='null'){			// Case : When it is name and max Price Filter.
				for(let rest of placeArray()){
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
			else if(nameString()!=undefined&&maxPrice()==undefined&&onlineDelivery()!='null'){			// Case : When it is name and Online delivery status filter

				if(onlineDelivery()=='true'){
						for(let rest of placeArray()){
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
			else if(nameString()==undefined&&maxPrice()!=undefined&&onlineDelivery()!='null'){			// Case : When it is maximum Price and Online Delivery status filter.

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
			else{																						// Case : If all the three Filters are applied at the same time.
				if(onlineDelivery()=='true'){
						for(let rest of placeArray()){
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
			placeArray([]);																				// Empty the placeArray so the menu list can be changed.
			placeArray(altArray);																		// Initialise the placeArray with the altArray so that only filtered results are seen on the menu
			resultCounter(placeArray().length);															// Update the resultCounter Observable with the length of the new placeArray, which will be a count of results found & accordingly UI can be changed
		}
		else{
			alert("No Filters Are Selected. Please Try With Filters Applied.");							// If user just clicks the filter button without applying any filters , then alert the user not to misuse it.
		}

	}

	self.resetFilters = function(){																		// Function which will reset all the filters.
		onlineDelivery("null");																			// Set the Online Delivery radio button to default value. This will be updated in the UI automatically because they are observables & are bound th respective inputs.
		nameString(undefined);																			// Set the name String Textbox to default value. This will be updated in the UI automatically because they are observables & are bound th respective inputs.
		maxPrice(undefined);																			// Set the maxPrice numberbox to default value. This will be updated in the UI automatically because they are observables & are bound th respective inputs.
		if(placeArrayCopy.length===0){																	// If the user clicks the filter button , when no filters have been previously applied :
			alert("No Filters Are Applied. Use Reset After Applying Filters.");							// Alert the user not to misuse the button.
		}
		else{
			placeArray([]);																				// Empty the placesArray
			placeArray(placeArrayCopy);																	// Populate it with the placesArrayCopy
			for(var rest of placeArray()){																// And Set all the markers on map
				rest.marker.setMap(map);
			}
			resultCounter(placeArray().length);															// Update the results found on UI
		}
	}

	self.listClick = function(arg){																		// This Function Will Be Called Whenever The List-item in sidebar is clicked. It is implemented using Knockout Click Binding.
		var targetName = arg.name;																		// store the name of the restaurent present in the clicked element
			for(let rest of placeArray()){																// Loop through all the restaurant objects ,
				if(rest.name ===targetName){															// When the name & the targetName Matches ,
					toggleBounce(rest.marker);															// Make the respective Marker bounce
					addInfoWindow(rest.infowindow,rest.marker);											// And show the info window.
				}
			}
	}



}
// End of ViewModel

ko.applyBindings(viewModel);																			// This Applies the viewmodel Bindings to the UI;



class Restaurants{																						// Restaurants Object to define the restaurant object, after obtaining the parsed JSON from Zomato API
	constructor(data){
		this.lat = data.location.latitude;																// latitude Property
		this.lng = data.location.longitude;																// longitutde Property
		this.cuisine = data.cuisines,																	// Cuisines Property
		this.name = data.name,																			// Name Property
		this.address = data.location.address,															// Address Property
		this.url = data.url;																			// Zomato Restaurent Page URL
		this.price_for_two = data.average_cost_for_two,													// Price For 2 property
		this.online_delivery = data.has_online_delivery,												// Online delivery status property
		this.marker,																					// This will associate the marker object of this restaurent to itself
		this.infowindow 																				// This will associate the infoWindow Object of this restaurent to itself
	};

};

var getRequest = function(lat,lng,radius,start=0){														//  This function will get data from Zomato API
		var Zurl = `https://developers.zomato.com/api/v2.1/search?start=${start}&count=20&lat=${lat}&lon=${lng}&radius=${radius}&sort=real_distance&order=asc`; // This is the URL to make GET request to. It will be auto edited according to the values passed.
		fetch(Zurl,{																					// fetch API function , operates on Zurl
			headers : Zheader																			// Include headers , to provide authentication
		}).then(function(response){																		// This returns a Promise , which when resolves then :
			if(response.status<400){																	// If the Response is error free,
				return response.json();																	// Return the Response.json() , which is again a promise
			}
			else{																						// Else if there's some error ,
				alert("An Error Occurred While Getting Your Request. Error Code : "+response.status);	// Alert the user about the error Code.
			}
		 }).then(handleData)																			// .then for response.json() , because it it resolves, pass in the data obtained to handleData function
		 .catch(function(er){																			// If there's an error in any promise resolving ,
			alert("There Was a Problem Loading Your Request. "+er);										// Alert user about the error ,
			console.log(er);																			// Log the error to console for debugging purposes.
		});
};

var handleData = function(response){																	// This function is passed to .then function after response.json() resolves. it accepts the arguement.
		var data = response.restaurants;																// assign the real data to data variable.
		placeArray([]);																					// Empty the placeArray so that there is no already lingering data in there.
		placeArrayCopy.length=0;																		// Empty the placeArrayCopy Array too.

		for(let rest of data){																			// Loop through all the restaurants obtained in the data

			var restaurant = new Restaurants(rest.restaurant);											// initialise a new restaurant object & pass in the data to extract data from
			var loc = {																					// Location of the present restaurant
				lat: restaurant.lat,
				lng: restaurant.lng
			};
			if(calculateDistance(centre,loc)<=radius){													// Function calculateDistance calculates distance between the restaurent and the present center, if it is under 1km
				placeArrayCopy.push(restaurant);														// Push that restaurant object in the placeArray and PlaceArrayCopy.
				placeArray.push(restaurant);}

		}
		resultCounter(placeArray().length);																// Update the resultCounter Observable with the placeArray's length
		setInfoWindows();																				// Function that creates info window for all the restaurants.
		createMarkers();																				// Function that Creates marker for all the restaurants.
		assignInfoToMarkers();																			// Function that assigns the infoWindows to their respective markers,
	}




var calculateDistance = function(origin,destination){													// Function That returns distance between two places , when their lat,lng pairs are passed as arguements.
	var start = new google.maps.LatLng(origin.lat,origin.lng);
	var stop = new google.maps.LatLng(destination.lat,destination.lng);
	return(google.maps.geometry.spherical.computeDistanceBetween(start,stop));
}



var createMarkers = function(){																			// Function that creates Markers of all the restaurants in the placeArray
	if(placeArray().length===0){																		// If Place Array is Empty, alert the user to pick another place , as no restaurants were found his chosen area.
		alert("No PLaces Found Within 1km Radius of this area. Try for Another Place");
	}
	else{																								// If placesArray is populated,then
	for(let rest of placeArray()){																		// Loop through all the restaurant objects in the array,
		var pos = {																						// make a position object indicating the lat-lng of the restaurent.
			lat: parseFloat(rest.lat),
			lng: parseFloat(rest.lng)
		};
		var marker = new google.maps.Marker({															// Make a new marker by google MAPS javascript API
			position: pos,																				// Pass in the position,
			map: map,																					// Map to which to apply to
			animation: google.maps.Animation.DROP														// And initial Animation
		});
		rest.marker = marker;																			// Assign the new made marker to the marker property of the restaurant object
		}
	}
}


var assignInfoToMarkers = function(){																	// Function that assigns the infowindow to the markers,
	for(let rest of placeArray()){																		// Loop through all the restaurant sin the placeArray
		rest.marker.addListener('click',function(){														// Add a event listener over "click" on all the markers
			addInfoWindow(rest.infowindow,rest.marker);													// And add the info window to that marker
			toggleBounce(rest.marker);																	// animate the marker when clicked.
		});
		}
}


var addInfoWindow = function(infoObj,marker){															// This function adds the info window , accepts the infoWindow Object & marker object as arguements
	if(activeInfoWindow){activeInfoWindow.close();}														// If some info window is active close it down first,
	infoObj.open(map,marker);																			// Then Open the info Window Over the associted marker on the given map
	activeInfoWindow = infoObj;																			// make that info Window the currently active info window.
};


var toggleBounce = function(marker){																	// This function animates the marker to bounce.
	if (marker.getAnimation() !== null) {																// If currently some animation is assigned , then
   	 			marker.setAnimation(null);																// First set the marker's animation to null
  			}
    marker.setAnimation(google.maps.Animation.BOUNCE);													// Then set the animation to BOUNCE Effect
    setTimeout(function(marker){																		// After 1 Second , Remove that bounce effect , so that , it only bounces for a second,
    			marker.setAnimation(null);
    		},1000,marker);

};


var removeMarkers = function(){																			// Function that removes all the placeArray markers that are on the map ,
	for(let rest of placeArray()){																		// Loop over all the restaurant Objects in the placeArray
		rest.marker.setMap(null);																		// set the marker's map to null.
	};
};


var setInfoWindows = function(){																		// Function that sets the info window to all the restaurants in the placeArray
		for(let resto of placeArray()){																	// Loop through all the restaurants in the placeArray
			var del;																					// a variable to store text according to the online delivery of the restaurant
			if(resto.online_delivery===0){																// If restaurant's online delivery property is 0 , set it to " not available ", else to "available"
				del = "Not Available";
			} else {
				del = "Available";
			}
			var infowindow = new google.maps.InfoWindow({												// Initialise  the info window as the google maps infoWindow object & pass in the content as template literal according to the restaurant info
				content : `<div class="info-div"><h2 class="info-head">${resto.name}</h2><ul class="info-list"><li><a href="${resto.url}">Visit Page</a></li><li><b>CUISINE :</b> ${resto.cuisine} </li><li><b>Address :</b>${resto.address} </li><li><b>Cost For 2 :</b> Rs. ${resto.price_for_two}</li><li> <b>Online Delivery : </b>${del} </li></ul></div>`
			});
			resto.infowindow = infowindow;																// Assign the infowindow object created to restaurant infowindow property.
		}

};


var googleError = function(){																			// Function to handle error if Google maps API is not loaded
	alert("Google APi Failed To Load ! Please Try Later.");
}



var initMap = function(){																				// Function That Gets called when the Google Maps API is done loading
	map = new google.maps.Map(document.getElementById('map'), {											// Initialise a new map object
          center: centre,
          zoom: 13
        });

	getRequest(centre.lat,centre.lng,radius);															// Send a GET request to ZOMATO API

	map.addListener('click',function(evt){																// Then add a "click" event listener on map , to get the lat,lng of the location clicked, drop a DIFFERENT pin there & then show the restaurants around that place.
		let posi = {																					// Position object containing lat,lng from the clicked map position
			lat: evt.latLng.lat(),
			lng: evt.latLng.lng()
		};
		centre = posi;																					// Make that clicked position center
		map.setCenter(centre);																			// Set the center of the map to the new center
		if(selectMarker){																				// If SelectMarker is contains a marker , then remove that marker from the map
			selectMarker.setMap(null);
		}
		selectMarker = new google.maps.Marker({															// Make a new Marker according to the position clicked by user , using a different icon
				position: posi,
				map: map,
				icon: "Asset_Files/Visual_Assets/myMarker.png",
				animation: google.maps.Animation.DROP
			});
		removeMarkers();																				// Remove All Other Markers for new reult to show,
		getRequest(posi.lat,posi.lng,radius);															// Send a new get request to ZOMATO API to get new restaurant results.
	});


}





