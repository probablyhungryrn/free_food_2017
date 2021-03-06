// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform, GoogleMaps , CalculateRank) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    GoogleMaps.init();
    CalculateRank.calculate();
  })
})

.controller('MyController', function($scope, $ionicModal) {

     $ionicModal.fromTemplateUrl('templates/addFood.html', {
        scope: $scope,
        animation: 'slide-in-up',
     }).then(function(modal) {
        $scope.modal = modal;
     });

     $scope.openModal = function() {
        $scope.modal.show();
     };

     $scope.closeModal = function(username, event, location, duration, num_peope) {
        $scope.modal.hide();

        let xhr = new XMLHttpRequest();
        var input = {"username": username, "location": location, "image": "das"};

        xhr.open("POST", "https://freefood-1bed5.firebaseio.com/inputData.json", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(input
        ));

     };

     //Cleanup the modal when we're done with it!
     $scope.$on('$destroy', function() {
        $scope.modal.remove();
     });

     // Execute action on hide modal
     $scope.$on('modal.hidden', function() {

     });

     // Execute action on remove modal
     $scope.$on('modal.removed', function() {
        // Execute action
     });
  })

  .controller('ProfileCtrl', function($scope, $ionicModal) {

       $ionicModal.fromTemplateUrl('templates/profile.html', {
          scope: $scope,
          animation: 'slide-in-up',
       }).then(function(modal) {
          $scope.modal = modal;
       });

       $scope.openModal = function() {
          $scope.modal.show();
       };

       $scope.closeModal = function() {
          $scope.modal.hide();
       };

       //Cleanup the modal when we're done with it!
       $scope.$on('$destroy', function() {
          $scope.modal.remove();
       });

       // Execute action on hide modal
       $scope.$on('modal.hidden', function() {
          // Execute action
       });

       // Execute action on remove modal
       $scope.$on('modal.removed', function() {
          // Execute action
       });
    })

.controller('AddFoodCtrl', function($scope, $ionicPopup){
	$scope.addFood = function(){
		var confirmPopup = $ionicPopup.confirm({
			title: '',
      templateUrl:'templates/addFood.js',
			button: [{
			  text: 'Publish',
			  type: 'button-block button-outline button-stable',
			  onTap: function(e) {
				  $scope.showAlert();
			  }
			}]
		});
		confirmPopup.then(function(res){
			if(res){

			}else{

			}
		});
	};

  // permissions
	$scope.showAlert = function() {
		var alertPopup = $ionicPopup.alert({
			title: 'we would like yo access',
			template: '<i class="ion-android-contacts"></i> Contact <br/> <i class="ion-android-locate"></i> Location',
			okType: 'button-block button-outline button-stable',

		});
		alertPopup.then(function(res) {
			console.log(45);
		});
	};

})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('map', {
    url: '/',
    templateUrl: 'templates/map.html',
    controller: 'MapCtrl'
  });

  $urlRouterProvider.otherwise("/");

})

.factory('Markers', function($http) {

  var markers = [{"id":"1","name":"Marker One","lat":"47.3901766","lng":"8.5128191"},{"id":"2","name":"zurich flughafen","lat":"47.4501395","lng":"8.5613664"}];

  return {
    getMarkers: function(){

      // return $http.get("http://localhost/markers.php").then(function(response){
      //     markers = response;
      //     return markers;
      // });
      return markers;
    }
  }

})

.factory('CalculateRank', function(){
  return {

    calculate: function()
  {
    let xhr = new XMLHttpRequest();
    var input = {"username":"Katniss Everdeen","Location": "Zurich", "image":"IMG_6178"};

    xhr.open("POST", "https://freefood-1bed5.firebaseio.com/freefoodInfo.json", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(input
    ));
  }
}
})

.factory('GoogleMaps', function($cordovaGeolocation, $ionicLoading, $rootScope, $cordovaNetwork, Markers, ConnectivityMonitor){

  var markerCache = [];
  var apiKey = false;
  var map = null;

  function initMap(){

    var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){

      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Wait until the map is loaded
      google.maps.event.addListenerOnce(map, 'idle', function(){

        var sampleStr =  '{"score":90,"labels":["natural foods","fruit"],"location":["Bondi Beach", -33.890542, 151.274856, 4]}';
        var json = sampleStr, obj = JSON.parse(json);
        var name = obj.score;
        var location = obj.location;
        var labels = obj.labels;
        console.log(name);

        let test = new XMLHttpRequest();
        let output;
        test.onreadystatechange = function() {
          if (test.readyState == XMLHttpRequest.DONE) {
            let output = JSON.parse(test.response);
            console.log(output);
          }
        }
        test.open('GET', 'https://freefood-1bed5.firebaseio.com/outputData.json?orderBy="score"&limitToFirst=10', true);
        test.send(null);


        var locations = [
          ['Zurich HBF', 47.3768866,8.541694, 10, '2017-10-17 00-13:00', 10, "Zürich Hauptbahnhof is the largest railway station in Switzerland. Zürich is a major railway hub, with services to and from across Switzerland and neighbouring European countries such as Germany, Italy, Austria and France."],
          ['Zurich Technopark', 47.389161,8.5150677, 10, '2017-9-17 8:00-10:00', 5, "Technopark Zürich is a technopark based in the municipality of Zürich in the Canton of Zürich in Switzerland."],
          ['Zurich Flughafen', 47.4582165,8.5554755, 30, '2017-9-19 18:00-19:00', 4, "Zürich Airport, also known as Kloten Airport, is the largest international airport of Switzerland and the principal hub of Swiss International Air Lines."],
          ['Zurich BachserMärt Forum', 47.382426,8.529462, 20, '2017-9-19 18:00-19:00', 9, "Food security and sovereignty, good and healthy food for all the people of the world, to achieve this needs a new understanding of food. We understand nutrition as common property and commons. A future food system is to be characterized by local, sustainable networks. The partners along the supply chain do not work profit-oriented, act in a participatory way and assume the equivalence of all parties involved. The local network is based on common cultural, ecological and social values. An open dialogical culture allows the integration of individual initiatives and works to balance the different interests of the actors along the food cycle."],
          ['FIFA World Football Museum', 47.362692, 8.531596, 10, '2017-9-20 18:00-19:00', 8, "The FIFA World Football Museum is an association football museum owned and operated by FIFA. The museum is located in Zürich, Switzerland, across town from the FIFA headquarters. It opened on 28 February 2016"],
          ['Zürich Yoga For All', 47.362441, 8.550294, 10, '2017-9-19 15:00-19:00', 7, "'Yoga For All' aims to provide space and time for people to come together to enjoy yoga and other social activities. Everyone is welcome from yoga fanatics to those who are just curious. Yoga people are the friendlies."],
        ];

        var marker, i;

        var pinColor = "FE7569";
        var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));

        for (i = 0; i < locations.length ; i++) {
          if (i > 2 && i < 5) {
            pinColor = "e841f4";
          } else if (i >= 5) {
            pinColor = "30e563";
          }

          pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
          new google.maps.Size(21, 34),
          new google.maps.Point(0,0),
          new google.maps.Point(10, 34));

          marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map,
            icon: pinImage
          });

          /*
          title: event name

          */
          function createWindowContent(event, time, food, desp, i, happy) {
            return '<div id="iw-container">' +
            '<div class="iw-title">'  + '  Health Rating:' + happy + ' </div>' +
            '<div class="iw-content">' +
              '<div class="iw-subTitle">' + event + '</div>' +
              '<img src="../img/location' + i + '.jpg" alt="Porcelain Factory of Vista Alegre" height="180" width="170">' +
              '<p> ' +  desp + "</p>" +
              '<div class="iw-subTitle">Time </div> ' + time + '\n' +
              '<div class="iw-subTitle">Food portions left ' + food + '</div>' +
            '</div>' +
            '<div class="iw-bottom-gradient"></div>' +
            '</div>';
          }

          var infoWindowContent = createWindowContent('hi', 'event', 'location', 'time', 'food', 'desp', 4, 3);

          var infowindow = new google.maps.InfoWindow({
            content: infoWindowContent
          });

          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent(createWindowContent(locations[i][0], locations[i][4],  locations[i][3], locations[i][6], i,
                                     locations[i][5]));
              infowindow.open(map, marker);
            }
          })(marker, i));

          /*
            * The google.maps.event.addListener() event waits for
            * the creation of the infowindow HTML structure 'domready'
            * and before the opening of the infowindow defined styles
            * are applied.
            */
            google.maps.event.addListener(infowindow, 'domready', function() {

                // Reference to the DIV which receives the contents of the infowindow using jQuery
                var iwOuter = $('.gm-style-iw');

                /* The DIV we want to change is above the .gm-style-iw DIV.
                  * So, we use jQuery and create a iwBackground variable,
                  * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
                  */
                var iwBackground = iwOuter.prev();

                // Remove the background shadow DIV
                iwBackground.children(':nth-child(2)').css({'display' : 'none'});

                // Remove the white background DIV
                iwBackground.children(':nth-child(4)').css({'display' : 'none'});

                // Taking advantage of the already established reference to
                // div .gm-style-iw with iwOuter variable.
                // You must set a new variable iwCloseBtn.
                // Using the .next() method of JQuery you reference the following div to .gm-style-iw.
                // Is this div that groups the close button elements.
                var iwCloseBtn = iwOuter.next();

                // Apply the desired effect to the close button
                iwCloseBtn.css({
                  opacity: '1', // by default the close button has an opacity of 0.7
                  right: '42px', top: '4px', // button repositioning
                  border: '7px solid #48b5e9', // increasing button border and new color
                  'border-radius': '13px', // circular effect
                  'box-shadow': '0 0 5px #3990B9' // 3D effect to highlight the button
                  });

                // The API automatically applies 0.7 opacity to the button after the mouseout event.
                // This function reverses this event to the desired value.
                iwCloseBtn.mouseout(function(){
                  $(this).css({opacity: '1'});
                });
              });
        }

        enableMap();

      });

    }, function(error){
      console.log("Could not get location");
    });

  }

  function enableMap(){
    $ionicLoading.hide();
  }

  function disableMap(){
    $ionicLoading.show({
      template: 'You must be connected to the Internet to view this map.'
    });
  }

  function loadGoogleMaps(){

    $ionicLoading.show({
      template: 'Loading Google Maps'
    });

    //This function will be called once the SDK has been loaded
    window.mapInit = function(){
      initMap();
    };

    //Create a script element to insert into the page
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "googleMaps";

    //Note the callback function in the URL is the one we created above
    if(apiKey){
      script.src = 'http://maps.google.com/maps/api/js?key=' + apiKey + '&sensor=true&callback=mapInit';
    }
    else {
      script.src = 'http://maps.google.com/maps/api/js?sensor=true&callback=mapInit';
    }

    document.body.appendChild(script);

  }

  function checkLoaded(){
    if(typeof google == "undefined" || typeof google.maps == "undefined"){
      loadGoogleMaps();
    } else {
      enableMap();
    }
  }

  function addConnectivityListeners(){

    if(ionic.Platform.isWebView()){

      // Check if the map is already loaded when the user comes online, if not, load it
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        checkLoaded();
      });

      // Disable the map when the user goes offline
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        disableMap();
      });

    }
    else {

      //Same as above but for when we are not running on a device
      window.addEventListener("online", function(e) {
        checkLoaded();
      }, false);

      window.addEventListener("offline", function(e) {
        disableMap();
      }, false);
    }

  }

  return {
    init: function(key){

      if(typeof key != "undefined"){
        apiKey = key;
      }

      if(typeof google == "undefined" || typeof google.maps == "undefined"){

        console.warn("Google Maps SDK needs to be loaded");

        disableMap();

        if(ConnectivityMonitor.isOnline()){
          loadGoogleMaps();
        }
      }
      else {
        if(ConnectivityMonitor.isOnline()){
          initMap();
          enableMap();
        } else {
          disableMap();
        }
      }

      addConnectivityListeners();

    }
  }

})

.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){

  return {
    isOnline: function(){

      if(ionic.Platform.isWebView()){
        return $cordovaNetwork.isOnline();
      } else {
        return navigator.onLine;
      }

    },
    ifOffline: function(){

      if(ionic.Platform.isWebView()){
        return !$cordovaNetwork.isOnline();
      } else {
        return !navigator.onLine;
      }

    }
  }
})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {

});
