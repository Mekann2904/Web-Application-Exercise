window.onload = function() {
    console.log("Window loaded");
    fetch('/get_names')
        .then(response => response.json())
        .then(names => {
            console.log("Names received:", names);
            let shelters = [];

            names.forEach(function(name) {
                shelters.push({ name: name, distance: null, retries: 100 });
            });

            function updateTable() {
                let table = document.getElementById('shelter-table');
                table.classList.add('location-table');
                table.style.borderSpacing = '0px 5px';
                table.style.fontSize = 'larger';
                table.style.borderCollapse = 'separate';
            
                let tableBody = table.getElementsByTagName('tbody')[0];
                tableBody.innerHTML = "";
            
                shelters.sort((a, b) => a.distance - b.distance);
            
                shelters.forEach(function(shelter) {
                    let row = document.createElement('tr');
                    row.classList.add('your-class-name');
                    row.style.backgroundColor = '#c0c0c0';
                    row.style.borderBottom = 'none';
            
                    let nameCell = document.createElement('td');
                    nameCell.textContent = shelter.name;
                    nameCell.style.padding = '10px';
                    row.appendChild(nameCell);
            
                    let distanceCell = document.createElement('td');
                    distanceCell.innerHTML = shelter.distance !== null 
                    ? `距離:<br><span style="float: right;">${shelter.distance} km</span>` 
                    : `<span style="float: right;">取得中</span>`;
                    distanceCell.style.padding = '10px';
                    row.appendChild(distanceCell);
            
                    tableBody.appendChild(row);
                });
                
                // 最も距離が短い避難所名を取得してリンクを更新
                let closestShelter = shelters.find(shelter => shelter.distance !== null);
                if (closestShelter) {
                    let googleMapsLink = document.getElementById('google-maps-link');
                    googleMapsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(closestShelter.name)}`;
                }
            }
            
            updateTable();

            function fetchDistanceAndAzimuth(shelter, city) {
                fetch(`/address_search/${city}`)
                    .then(response => response.json())
                    .then(cityCoords => {
                        console.log("City coordinates:", cityCoords);
                        fetch(`/get_coordinates/${shelter.name}`)
                            .then(response => response.json())
                            .then(shelterCoords => {
                                console.log("Shelter coordinates for", shelter.name, ":", shelterCoords);
                                fetch('/calculate_distance', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        lat1: cityCoords.lat,
                                        lon1: cityCoords.lon,
                                        lat2: shelterCoords.latitude,
                                        lon2: shelterCoords.longitude
                                    })
                                })
                                .then(response => response.json())
                                .then(result => {
                                    console.log("Distance and azimuths:", result);
                                    let distanceKm = (parseFloat(result.distance) / 1000).toFixed(1);

                                    if (isNaN(distanceKm) || result.azimuth1 === 'N/A' || result.azimuth2 === 'N/A') {
                                        if (shelter.retries > 0) {
                                            console.warn(`Retrying... (${10 - shelter.retries + 1}/10)`);
                                            setTimeout(() => {
                                                shelter.retries--;
                                                fetchDistanceAndAzimuth(shelter, city);
                                            }, 1000);
                                        } else {
                                            shelter.distance = null;
                                            updateTable();
                                        }
                                    } else {
                                        shelter.distance = distanceKm;
                                        updateTable();
                                    }
                                })
                                .catch(error => {
                                    console.error("Distance calculation error:", error);
                                    if (shelter.retries > 0) {
                                        console.warn(`Retrying... (${10 - shelter.retries + 1}/10)`);
                                        setTimeout(() => {
                                            shelter.retries--;
                                            fetchDistanceAndAzimuth(shelter, city);
                                        }, 1000);
                                    } else {
                                        shelter.distance = null;
                                        updateTable();
                                    }
                                });
                            })
                            .catch(error => {
                                console.error("Shelter coordinates error:", error);
                                shelter.distance = null;
                                updateTable();
                            });
                    })
                    .catch(error => {
                        console.error("City coordinates error:", error);
                        shelter.distance = null;
                        updateTable();
                    });
            }

            fetch('/get_last_location')
                .then(response => response.json())
                .then(data => {
                    console.log("Last location received:", data.location);
                    const city = data.location;
                    shelters.forEach(shelter => fetchDistanceAndAzimuth(shelter, city));
                })
                .catch(error => {
                    console.error("Fetch last location error:", error);
                });
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
};