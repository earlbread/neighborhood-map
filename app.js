function initMap() {
  var metrotown = {lat: 49.227626, lng: -123.007576};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: metrotown,
    disableDefaultUI: true
  });
  var marker = new google.maps.Marker({
    position: metrotown,
    map: map
  });
}
