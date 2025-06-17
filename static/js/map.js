(g => {
    var h, a, k, 
        p = "The Google Maps JavaScript API", 
        c = "google", 
        l = "importLibrary", 
        q = "__ib__", 
        m = document, 
        b = window;

    b = b[c] || (b[c] = {});
    var d = b.maps || (b.maps = {}),
        r = new Set,
        e = new URLSearchParams,
        u = () => h || (h = new Promise(async (f, n) => {
            await (a = m.createElement("script"));
            e.set("libraries", [...r] + "");
            for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
            e.set("callback", c + ".maps." + q);
            a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
            d[q] = f;
            a.onerror = () => h = n(Error(p + " could not load."));
            a.nonce = m.querySelector("script[nonce]")?.nonce || "";
            m.head.append(a);
        }));
    d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n));
})({
    key: "AIzaSyC4A25YK46crE2lPaTG_3SCO_xmQojgkt0",
    v: "weekly"
});

document.addEventListener("DOMContentLoaded", function () {
    const largeImage = document.getElementById("large-image");
    const startButton = document.getElementById("start-slideshow");
    const endButton = document.getElementById("end-slideshow");
    const tableRows = document.querySelectorAll("table tr");

    let slideshowInterval;
    let isHovering = false;

    tableRows.forEach(row => {
        row.addEventListener("mouseenter", function () {
            const img = row.querySelector("img");
            if (img) {
                largeImage.src = img.src;
                isHovering = true;
            }
            row.classList.add("hover-row");
        });

        row.addEventListener("mouseleave", function () {
            row.classList.remove("hover-row");
            isHovering = false;
        });
    });

    function startSlideshow() {
        const images = Array.from(document.querySelectorAll("table img")).map(img => img.src);
        let index = 0;

        if (slideshowInterval) clearInterval(slideshowInterval);

        slideshowInterval = setInterval(() => {
            if (!isHovering) {
                largeImage.src = images[index];
                index = (index + 1) % images.length;
            }
        }, 2000);
    }

    function stopSlideshow() {
        clearInterval(slideshowInterval);
    }

    startButton.addEventListener("click", startSlideshow);
    endButton.addEventListener("click", stopSlideshow);
    initMap();
});

let map, directionsService, directionsRenderer;
async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const { Geocoder } = await google.maps.importLibrary("geocoding");
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    const universityCoords = { lat: 44.9727, lng: -93.2354 };
    map = new Map(document.getElementById("map"), {
        zoom: 14,
        center: universityCoords,
    });
    new google.maps.Marker({
        position: universityCoords,
        map: map,
        title: "University Location",
    });

    const geocoder = new Geocoder();
    document.querySelectorAll("table tr").forEach(row => {
        const locationCell = row.cells[3];
        if (locationCell) {
            const address = locationCell.textContent.trim();
            if (address) {
                const eventDate = row.cells[0].textContent.trim();
                const eventName = row.cells[1].textContent.trim();
                const eventTime = row.cells[2].textContent.trim();

                geocodeAddress(address, map, geocoder, eventName, { date: eventDate, time: eventTime });
            }
        }
    });
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("mapDirections"));

    document.getElementById("goButton").addEventListener("click", async function () {
        const destination = document.getElementById("destination").value;
        const selectedMode = document.querySelector('input[name="travelMode"]:checked').value;

        const userLocation = await getCurrentLocation() || universityCoords;
        document.getElementById("mapDirections").style.display = 'block';
        document.getElementById("directionsPanel").style.width = '20%'

        getDirections(userLocation, destination, selectedMode, directionsService, directionsRenderer);
    });

    document.getElementById("searchButton").addEventListener("click", function () {
        const category = document.getElementById("categorySelect").value;
        const query = category === "other" ? document.getElementById("otherSearch").value : category;
        const distance = parseInt(document.getElementById("distanceInput").value, 10) || 500;

        if (!query) {
            alert("Please enter a valid search query or select a category.");
            return;
        }

        searchNearbyPlaces(query, distance);
    });
}

async function geocodeAddress(address, map, geocoder, eventName, eventDetails) {
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK" && results[0]) {
            const position = results[0].geometry.location;
            const marker = new google.maps.Marker({
                position: position,
                map: map,
                icon: {
                    url: "static/img/Goldy.png",
                    scaledSize: new google.maps.Size(30, 30),
                },
                title: address,
            });

            const infoContent = `
                <p><strong>${eventName}</strong></p>
                <p>${eventDetails.date} ${eventDetails.time}</p>
            `;

            const infoWindow = new google.maps.InfoWindow({
                content: infoContent,
            });

            marker.addListener("click", () => {
                infoWindow.open(map, marker);
            });
        }
    });
}



let events = [];
let table = document.getElementById('eventTable');
let rows = table.getElementsByTagName('tr');

for (let i = 1; i < rows.length; i++) {
    let cells = rows[i].getElementsByTagName('td');
    let name = cells[0].textContent;
    let location = cells[1].textContent;
    events.push({ name, location });
}

function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                resolve({ lat: latitude, lng: longitude });
            }, () => {
                console.log("Geolocation denied, using fallback location.");
                resolve(null); // Fallback to the default location if geolocation is denied
            });
        } else {
            console.log("Geolocation not supported, using fallback location.");
            resolve(null); // Fallback if geolocation is not supported
        }
    });
}
function getDirections(origin, destination, travelMode, directionsService, directionsRenderer) {
    const request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode[travelMode.toUpperCase()], // Ensure correct travel mode
    };

    directionsService.route(request, (response, status) => {
        if (status === "OK") {
            directionsRenderer.setDirections(response); // Display the route on the map and the panel
        } else {
            console.log("Error fetching directions: " + status);
        }
    });
}

function success(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
}
function error() {
    console.log("location denied using the fallback");
    useFallbackLocation();
}

function useFallbackLocation() {
    let fallbackLocation = { lat: 44.9727, lng: -93.2354 };
}

document.getElementById('categorySelect').addEventListener('change', function() {
    let otherInput = document.getElementById('otherSearch');
    if (this.value === 'other') {
        otherInput.disabled = false;
    } else {
        otherInput.disabled = true;
    }
});
function searchNearbyPlaces(query, radius) {
    const service = new google.maps.places.PlacesService(map);
    const userLocation = { lat: 44.9727, lng: -93.2354 };
    
    const request = {
        location: userLocation,
        radius: radius,
        query: query,
    };

    service.textSearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            displayPlaces(results);
        } else {
            alert("Search failed: " + status);
        }
    });
}

function displayPlaces(places) {
    const directionsPanel = document.getElementById("directionsResults");
    directionsPanel.innerHTML = "";

    places.forEach(place => {
        const placeDiv = document.createElement("div");
        placeDiv.innerHTML = `
            <strong>${place.name}</strong><br>
            ${place.formatted_address}<br>
            <a href="https://www.google.com/maps?q=${place.geometry.location.lat()},${place.geometry.location.lng()}" target="_blank">View on Map</a>
        `;
        directionsPanel.appendChild(placeDiv);
        
        new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name,
        });
    });
}