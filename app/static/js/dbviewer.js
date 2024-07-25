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
                let tableBody = document.getElementById('shelter-table').getElementsByTagName('tbody')[0];
                tableBody.innerHTML = "";

                shelters.sort((a, b) => a.distance - b.distance);

                shelters.forEach(function(shelter) {
                    let row = document.createElement('tr');

                    let nameCell = document.createElement('td');
                    nameCell.textContent = shelter.name;
                    row.appendChild(nameCell);

                    let distanceCell = document.createElement('td');
                    distanceCell.textContent = shelter.distance !== null ? `距離: ${shelter.distance} km` : "取得中";
                    row.appendChild(distanceCell);

                    tableBody.appendChild(row);
                });
            }

            function fetchDistanceAndAzimuth(shelter, city) {
                // /get_last_locationから取得した都市名の緯度経度を取得
                fetch(`/address_search/${city}`)
                    .then(response => response.json())
                    .then(cityCoords => {
                        console.log("City coordinates:", cityCoords);
                        // 避難所の緯度経度を取得
                        fetch(`/get_coordinates/${shelter.name}`)
                            .then(response => response.json())
                            .then(shelterCoords => {
                                console.log("Shelter coordinates for", shelter.name, ":", shelterCoords);
                                // 距離と方位角を計算
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
                                    let distanceKm = (parseFloat(result.distance) / 1000).toFixed(1); // メートルからキロメートルに変換し、少数第一位まで丸める

                                    if (isNaN(distanceKm) || result.azimuth1 === 'N/A' || result.azimuth2 === 'N/A') {
                                        if (shelter.retries > 0) {
                                            console.warn(`Retrying... (${10 - shelter.retries + 1}/10)`);
                                            setTimeout(() => {
                                                shelter.retries--;
                                                fetchDistanceAndAzimuth(shelter, city);
                                            }, 1000); // 1秒待つ
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
                                        }, 100); // 1秒待つ
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
                    const city = data.location;  // 取得した都市名を保存
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