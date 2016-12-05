'use strict';

/* Set error flag to display alert only once */
var yelpError = false;

/* Locations model */
var locations = [
    {
        title: 'Chipotle Mexican Grill',
        position: { lat: 49.2260222, lng: -123.002301 },
        description: 'Fast-food chain offering Mexican fare, including design-your-own burritos, tacos & bowls.',
        yelpId: 'chipotle-mexican-grill-burnaby'
    },
    {
        title: 'A&W',
        position: { lat: 49.2260751, lng: -123.0020549 },
        description: 'Canadian fast food restaurant chain.',
        yelpId: 'a-and-w-burnaby-3'
    },
    {
        title: 'Sushi Garden',
        position: { lat: 49.2292013, lng: -123.0009336 },
        description: 'Modest but contemporary outpost with a classic Japanese menu of sushi, tempura, udon & rice bowls.',
        yelpId: 'sushi-garden-japanese-restaurant-burnaby'
    },
    {
        title: 'Metropolis at Metrotown',
        position: {lat: 49.226771, lng: -123.001318},
        description: 'The biggest mall in burnaby',
        yelpId: 'metropolis-at-metrotown-burnaby'
    },
    {
        title: 'Metrotown Public Library',
        position: {lat: 49.2282259, lng: -123.0064567},
        description: 'Metrotown Public Library',
        yelpId: 'burnaby-public-library-burnaby-4'
    }
];

/* Create a map */
function initMap(center) {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: center,
        disableDefaultUI: true
    });

    return map;
}

/* Generate info window content and populate it */
function populateInfoWindow(map, marker, infoWindow) {
    map.panTo(marker.getPosition());

    if(infoWindow.marker != marker) {
        var content = '';

        if (marker.content) {
            content = marker.content;
        } else if (marker.yelpInfo) {
            var yelpInfo = marker.yelpInfo;
            var source = document.getElementById('iw-template').innerHTML;
            var template = Handlebars.compile(source);
            var context = {
                title: marker.title,
                url: yelpInfo.url,
                rating_img_url: yelpInfo.rating_img_url,
                image_url: yelpInfo.image_url,
                description: marker.description
            };

            content = template(context);
            marker.content = content;
        } else {
            content = '<div>' + marker.title + '</div>';
        }

        marker.setAnimation(google.maps.Animation.DROP);

        infoWindow.marker = marker;
        infoWindow.setContent(content);
        infoWindow.open(map, marker);

        infoWindow.addListener('closeclick', function() {
            infoWindow.marker = null;
        });
    }
}

/* Initialize markers and info window */
function initMapInfo(map, markers, largeInfoWindow) {
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < locations.length; i++) {
        var loc = locations[i];
        var marker = new google.maps.Marker({
            position: loc.position,
            title: loc.title,
            id: i
        });
        getYelpInfo(marker, loc.yelpId);

        marker.addListener('click', function() {
            populateInfoWindow(map, this, largeInfoWindow);
        });

        marker.setMap(map);
        marker.description = loc.description;
        marker.populateInfoWindow = populateInfoWindow;

        markers.push(marker);
        bounds.extend(marker.position);
    }

    map.fitBounds(bounds);

    /* Fit boundaries responsively */
    window.onresize = function () {
        map.fitBounds(bounds);
    }
}

/* Get Yelp information for info window from proxy server */
function getYelpInfo(marker, yelp_id) {
    /* Use proxy server to protect API Key */
    var YELP_PROXY_URL = 'https://udacity-webdevelopment-142016.appspot.com/get_yelp_info/';
    var yelp_url = YELP_PROXY_URL + yelp_id;

    $.ajax({
        url: yelp_url,
        success: function(results) {
            marker.yelpInfo = results;
        },
        error: function() {
            if (!yelpError) {
                alert('Yelp API is not loaded. Yelp information may not be displayed properly.');
                yelpError = true;
            }
            marker.yelpInfo = null;
        }
    });
}

/* Knockout View Model */
var ViewModel = function(map, markers, infoWindow) {
    var self = this;

    self.searchText = ko.observable('');
    self.shouldShowLocations = ko.observable(false);

    self.toggleShowLocations = function() {
        self.shouldShowLocations(!self.shouldShowLocations());
    };

    self.searchedLocations = ko.computed(function() {
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];


            if (marker.title.toLowerCase().includes(self.searchText().toLowerCase())) {
                marker.setVisible(true);
            } else {
                marker.setVisible(false);
            }
        }

        return markers.filter(function(marker) {
            return marker.map !== null;
        });
    });

    self.removeSearchText = function() {
        self.shouldShowLocations(false);
        self.searchText('');
    };

    self.populateInfoWindow = function(marker) {
        self.removeSearchText('');
        marker.populateInfoWindow(map, marker, infoWindow);
    };
};

/* Callback of Google map API */
function initApp() {
    var map  = null;
    var markers = [];
    var largeInfoWindow = new google.maps.InfoWindow();

    map = initMap(locations[0].position);
    initMapInfo(map, markers, largeInfoWindow);

    ko.applyBindings(new ViewModel(map, markers, largeInfoWindow));
}


/* Fallback when failed Google map loading */
function googleError() {
    document.body.innerHTML = '';
    document.body.textContent = 'The Google API server is not responding.\
    Please check your network connection.';
}
