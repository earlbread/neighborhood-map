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

    locations.forEach(function(loc) {
        var marker = new google.maps.Marker({
            position: loc.location,
            map: map,
            title: loc.title
        });

        var infoWindow = new google.maps.InfoWindow({
            content: loc.description
        });

        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });

        markers.push(marker);
        infoWindows.push(infoWindow);
    });
}
