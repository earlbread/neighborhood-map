var locations = [
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
    var self = this;

    self.searchText = ko.observable('');

    self.searchedLocations = ko.computed(function() {
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
