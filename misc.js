
var Zheader = new Headers();
Zheader.append("user_key","4c34b80cd92f9d38992e2d0def177a9d");

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

var getRequest = function(lat = 19.196393236429245,lng = 72.81887810305784,radius = 1000,arr){
		var Zurl = `https://developers.zomato.com/api/v2.1/search?count=20&lat=${lat}&lon=${lng}&radius=${radius}&sort=real_distance&order=asc`;
		fetch(Zurl,{
			headers : Zheader;
		}).then(function(response){
			if(response.status<400){
				return response.json();
			}
			else{
				alert("An Error Occurred While Getting Your Request. Error Code : "+response.status);
			}
		 }).then( /*Enter The Function Name Responsible for handling the responses*/ ).catch(function(){
			alert("There Was a Problem Loading Your Request. Please Try Again Later.");
		});
	};






var viewModel = function(){
	self = this;

	var slide = false;

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
						console.log("I'm Done");
						slide=false;
					},500);
				}
				}

	var placeArray = ko.observableArray();


}



ko.applyBindings(viewModel);





// Event Handler that Works For sliding the menu
// $(".icon").on("click",function(){
// 	if(slided===false){
// 	$(".sidebar").toggleClass("hidden");
// 	$(".sidebar").toggleClass("slideForward");
// 	setTimeout(function(){
// 		$("#text-containment").toggleClass("hidden");
// 		$(".sidebar").toggleClass("slideForward");
// 	},500);
// 	slided = true;
// 	}
// 	else{
// 		$("#text-containment").toggleClass("hidden");
// 		$(".sidebar").toggleClass("slideBackward");
// 		setTimeout(function(){
// 			$(".sidebar").toggleClass("hidden");
// 			$(".sidebar").toggleClass("slideBackward");
// 			console.log("I'm Done");
// 			slided=false;
// 		},500);

// 	}
// });