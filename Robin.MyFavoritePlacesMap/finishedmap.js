L.mapbox.accessToken = 'pk.eyJ1IjoiamVmZnN0ZXJuIiwiYSI6IlAzRFFiN0EifQ.mNWvayrLEw9wULuq0sopyA';
var map = L.mapbox.map('map', 'jeffstern.6878aba5')
  .setView([38.12367, -76.81229], 9);


var myLayer = L.mapbox.featureLayer().addTo(map);
// Creates a single, draggable marker on the page.
var m = L.marker(new L.LatLng(42.27624, -83.738176), {
    icon: L.mapbox.marker.icon({
        'marker-color': '32CF93'
    }),
    draggable: true
}).bindPopup('Drag me to find the closest park!').addTo(map);

m.on('dragend', function() {
    populateListing();
});


var geojson = {
    type: 'FeatureCollection',

    // This is an array of Map Point objects
    features: [
    {
        type: 'Feature',
        properties: {
            title: 'Eberwhite Woods',
            description: 'A hidden gem, this walking trail through the woods is nestled away in a neighborhood',
            'marker-color': '#855723',
            'marker-size': 'large',
            'marker-symbol': 'park',
        },
        geometry: {
            type: 'Point',
            coordinates: [-83.7684, 42.2729]
        }
    },
        {
        type: 'Feature',
        properties: {
            title: 'Allmendinger Park',
            description: 'On Football Saturdays this park is always home to tasty hamburgers and hotdogs',
            'marker-color': '#D57500',
            'marker-size': 'large',
            'marker-symbol': 'park2',
        },
        geometry: {
            type: 'Point',
            coordinates: [-83.7561, 42.2674]
        }
    },
    {
        type: 'Feature',
        properties: {
            title: 'Argo Nature Area',
            description: 'Jump in a canoe or kayak and paddle down the river.',
            'marker-color': '#558D3C',
            'marker-size': 'large',
            'marker-symbol': 'park',
        },
        geometry: {
            type: 'Point',
            coordinates: [-83.7423, 42.2951]
        }
    },
        {
        type: 'Feature',
        properties: {
            title: 'Gallup Park',
            description: 'Gallup is right on the river and flat which makes it a perfect running spot',
            'marker-color': '#4E6172',
            'marker-size': 'large',
            'marker-symbol': 'park2',
        },
        geometry: {
            type: 'Point',
            coordinates: [-83.6923, 42.2732]
        }
    },
    {
        type: 'Feature',
        properties: {
            title: 'The Arb!',
            description: 'The park of all parks! Wonderful trails, river views, and floura, and a great hangout spot for Michigan students.',
            'marker-color': '#613318',
            'marker-size': 'large',
            'marker-symbol': 'park',
        },
        geometry: {
            type: 'Point',
            coordinates: [-83.7242, 42.2828]
        }
    },
    ]
};

myLayer.setGeoJSON(geojson); // Adds all of the points to the map

// Makes sure that map's initial zoom contains all of the points
map.on('ready', function() {
    map.fitBounds(myLayer.getBounds());
    map.legendControl.addLegend(document.getElementById('legend').innerHTML);
    m.openPopup();
    populateListing();
});





function populateListing() {
    // Clear out the listing container first.
    info.innerHTML = '';
    var listings = [];

    // Build a listing of markers
    myLayer.eachLayer(function(marker) {
        // Draggable marker coordinates.
        var home = m.getLatLng();
        var metresToMiles = 0.000621371192;
        var distance = (metresToMiles * home.distanceTo(marker.getLatLng())).toFixed(1);

        var link = document.createElement('a');
        link.className = 'item';
        link.href = '#';
        link.setAttribute('data-distance', distance);

        // Populate content from each markers object.
        link.innerHTML = marker.feature.properties.title +
            '<br /><small>' + distance + ' mi. away</small>';

        link.onclick = function() {
            if (/active/.test(this.className)) {
                this.className = this.className.replace(/active/, '').replace(/\s\s*$/, '');
            } else {
                var siblings = info.getElementsByTagName('a');
                for (var i = 0; i < siblings.length; i++) {
                    siblings[i].className = siblings[i].className
                    .replace(/active/, '').replace(/\s\s*$/, '');
                };
                this.className += ' active';

                // When a menu item is clicked, animate the map to center
                // its associated marker and open its popup.
                map.panTo(marker.getLatLng());
                marker.openPopup();
            }
            return false;
        };

        listings.push(link);
    });

    // Sort the listing based on the
    // assigned attribute, 'data-listing'
    listings.sort(function(a, b) {
        return a.getAttribute('data-distance') - b.getAttribute('data-distance');
    });

    $("#info").prepend("<h4>The closest parks are:</h4>")

    listings.forEach(function(listing) {
        info.appendChild(listing);
    });


}

