# NeighbourHood Map Project

## About
This Project is the implementation of a Web APP which shows the restaurant location , & Info about that restaurant within a km of your pinned location, majorly in New Delhi, India.

## FrameWorks Used
  1. KnockoutJS
  2. Jquery
  3. VannilaJS

## APIs Used
  1. Google Maps Javascript APIs - For Map Loading Services.
  2. ZOMATO API - For Restaurant Database.

## How It Works
* Web APP can be easily accessed By visiting the Link associated with this repository.
* On Opening WebApp , page gives a asnyc call to load Google Maps Javascript API, Which loads the map.
* When the map loads, async call to Zomato API is Given using Javascript fetch API feature.

## How To Use It
#### Basic Functionality
* Initially , Default Location Loaded is the centre of New Delhi, and restaurants shown are within the 1km range of that location.
* Wherever you click on the Map, Within New Delhi Only , That Location is pinned with a blue custom Marker
![Custom Blue Pin](Asset_Files/Visual_Assets/myMarker.png)
* Then Results within 1km around user-dropped pin are shown on the map.
* Clicking On a marker will show information about that place,

#### Filter And Sidebar.
* Icon in top left corner , is a **Menu toggler**, Clicking it, will reveal a list view for the restaurants found by the app , and some filter options.
##### Filters
* There are total of 3 Filters
  * **Price For Two** - You can enter the max price of the Average price for two , and it will how you restaurants under your budget!
  * **Name** - You can Enter name of the Restaurant , And If It is around that Place, it will be filtered! Substrings are also allowed , you dont need to type full name of restaurant.
  * **Online Delivery Ability** - You can filter Results on the basis of whether online booking is available or not.

>All The Filters Can Be Applied at once. But To apply a new filter after you've initiated a search for previusly applied filter by clicking on **Refine Search** , Use **Reset All Filters** Button First , So that All the Previous Results Come back , then initiate other filter request.

* **Refine Search** Button will apply the filters you chose & show the specific results.
* **Reset All Filters** Button will revert all filters and show the original result.
##### Sidebar
* Side Bar Contains The Names of all the Restaurants found.
* Clicking on any Restaurant Name will pop an informative
 window over the marker of that place, showing you the relevant information.
* SideBar Can be Toggled by the top left icon.

## Attribution
* [Zomato API](https://developers.zomato.com/api#headline1) - by Zomato - for Restaurant Information & location.
* [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/tutorial) - for interactive map & functions used to implement that.
* Blue Marker Icon - [By Snip Master](https://www.iconfinder.com/snipicons)
