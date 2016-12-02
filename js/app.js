'use strict'

var locations = [
    {
        title: 'Chipotle Mexican Grill',
        position: { lat: 49.2261894, lng: -123.0027339 },
        description: 'Fast-food chain offering Mexican fare, including design-your-own burritos, tacos & bowls.'
    },
    {
        title: 'A&W',
        position: { lat: 49.225832, lng: -123.0024901 },
        description: 'Canadian fast food restaurant chain.'
    },
    {
        title: 'Sushi Garden',
        position: { lat: 49.2284805, lng: -123.0006349 },
        description: 'Modest but contemporary outpost with a classic Japanese menu of sushi, tempura, udon & rice bowls.'
    },
    {
        title: 'Metropolis at Metrotown',
        position: {lat: 49.226771, lng: -123.001318},
        description: 'The biggest mall in burnaby'
    },
    {
        title: 'Metrotown Public Library',
        position: {lat: 49.228365, lng: -123.006709},
        description: 'Metrotown Public Library'
    }
];

function initMap(center) {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: center,
        disableDefaultUI: true
    });

    return map;
}

function populateInfoWindow(map, marker, infoWindow) {
    if(infoWindow.marker != marker) {
        marker.setAnimation(google.maps.Animation.DROP);

        infoWindow.marker = marker;
        infoWindow.setContent('<div>' + marker.title + '</div>');
        infoWindow.open(map, marker);

        infoWindow.addListener('closeclick', function() {
            infoWindow.marker = null;
        });
    }
};

function initMapInfo(map, markers, largeInfoWindow) {
    for (var i = 0; i < locations.length; i++) {
        var loc = locations[i];
        var marker = new google.maps.Marker({
            position: loc.position,
            title: loc.title,
            id: i
        });

        marker.addListener('click', function() {
            populateInfoWindow(map, this, largeInfoWindow);
        });

        marker.infoWindow = populateInfoWindow;

        markers.push(marker);
    }
}

var ViewModel = function(map, markers, infoWindow) {
    'use strict'
    var self = this;

    self.searchText = ko.observable('');
    self.shouldShowLocations = ko.observable(false);

    self.toggleShowLocations = function() {
        self.shouldShowLocations(!self.shouldShowLocations());
    }

    self.searchedLocations = ko.computed(function() {
        self.shouldShowLocations(false);
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];


            if (marker.title.toLowerCase().includes(self.searchText().toLowerCase())) {
                marker.setMap(map);
            } else {
                marker.setMap(null);
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
        self.searchText('');
        marker.infoWindow(map, marker, infoWindow);
    };
};

function initApp() {
    var map  = null;
    var markers = [];
    var largeInfoWindow = new google.maps.InfoWindow();

    map = initMap(locations[0].position);
    initMapInfo(map, markers, largeInfoWindow);

    ko.applyBindings(new ViewModel(map, markers, largeInfoWindow));
}

function googleError() {
    document.body.innerHTML = '';
    document.body.textContent = 'The Google API server is not responding.\
                                        Please check your network connection.';
}
