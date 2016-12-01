var locations = [
    {
        title: 'Metropolis at Metrotown',
        location: {lat: 49.226771, lng: -123.001318},
        description: 'The biggest mall in burnaby'
    },
    {
        title: 'Metrotown Public Library',
        location: {lat: 49.228365, lng: -123.006709},
        description: 'Metrotown Public Library'
    }
];

var ViewModel = function() {
    var self = this;
    this.searchText = ko.observable('');
    this.map = null;


    var markers = [];
    var largeInfoWindow = new google.maps.InfoWindow();

    function initMap(center) {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: center,
            disableDefaultUI: true
        });

        return map;
    }

    for (var i = 0; i < locations.length; i++) {
        var loc = locations[i];
        var marker = new google.maps.Marker({
            position: loc.location,
            title: loc.title,
            animation: google.maps.Animation.DROP,
            id: i
        });

        marker.addListener('click', function() {
            populateInfoWindow(self.map, this, largeInfoWindow);
        });

        markers.push(marker);
    }

    var showListings = function(map) {
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    };

    var hideListings = function() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    };

    var populateInfoWindow = function(map, marker, infoWindow) {
        if(infoWindow.marker != marker) {
            infoWindow.marker = marker;
            infoWindow.setContent('<div>' + marker.title + '</div>');
            infoWindow.open(map, marker);

            infoWindow.addListener('closeclick', function() {
                infoWindow.marker = null;
            });
        }
    };

    this.map = initMap(locations[0].location);
    showListings(this.map);
};

function initApp() {
    ko.applyBindings(new ViewModel());
}

function googleError() {
    document.body.innerHTML = '';
    document.body.textContent = 'The Google API server is not responding.\
                                        Please check your network connection.';
}
