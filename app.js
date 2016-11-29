var markers = [];
var infoWindows = [];

function initMap() {
    var metrotown = {lat: 49.227626, lng: -123.007576};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: metrotown,
        disableDefaultUI: true
    });

    var locations = [
        {
            title: 'Metrotown Public Library',
            location: {lat: 49.228365, lng: -123.006709},
            description: 'Metrotown Public Library'
        },
        {
            title: 'Metropolis at Metrotown',
            location: {lat: 49.226771, lng: -123.001318},
            description: 'The biggest mall in burnaby'
        }
    ];

    var largeInfoWindow = new google.maps.InfoWindow();

    for (var i = 0; i < locations.length; i++) {
        var loc = locations[i];
        var marker = new google.maps.Marker({
            position: loc.location,
            title: loc.title,
            animation: google.maps.Animation.DROP,
            id: i
        });

        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfoWindow);
        });

        markers.push(marker);
    }

    document.getElementById('show-listings').addEventListener('click', ShowListings);
    document.getElementById('hide-listings').addEventListener('click', HideListings);

    function ShowListings() {
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }

    function HideListings() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }

    function populateInfoWindow(marker, infoWindow) {
        if(infoWindow.marker != marker) {
            infoWindow.marker = marker;
            infoWindow.setContent('<div>' + marker.title + '</div>');
            infoWindow.open(map, marker);

            infoWindow.addListener('closeclick', function() {
                infoWindow.setMarker(null);
            });
        }
    }
}
