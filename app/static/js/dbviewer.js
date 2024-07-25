window.onload = function() {
    console.log("Window loaded");
    fetch('/get_names')
        .then(response => response.json())
        .then(names => {
            console.log("Names received:", names);
            let tableBody = document.getElementById('shelter-table').getElementsByTagName('tbody')[0];

            names.forEach(function(name) {
                let row = document.createElement('tr');

                let nameCell = document.createElement('td');
                nameCell.textContent = name;
                row.appendChild(nameCell);

                let distanceCell = document.createElement('td');
                distanceCell.textContent = "計算中..."; // 初期表示
                row.appendChild(distanceCell);

                tableBody.appendChild(row);

                // リトライ回数の設定
                const maxRetries = 3;

                // 距離と方位角を取得する関数
                function fetchDistanceAndAzimuth(retries) {
                    // 那覇の緯度経度を取得
                    fetch(`/address_search/那覇`)
                        .then(response => response.json())
                        .then(cityCoords => {
                            console.log("City coordinates:", cityCoords);
                            // 避難所の緯度経度を取得
                            fetch(`/get_coordinates/${name}`)
                                .then(response => response.json())
                                .then(shelterCoords => {
                                    console.log("Shelter coordinates for", name, ":", shelterCoords);
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
                                            if (retries > 0) {
                                                console.warn(`Retrying... (${maxRetries - retries + 1}/${maxRetries})`);
                                                setTimeout(() => {
                                                    fetchDistanceAndAzimuth(retries - 1);
                                                }, 3000); // 3秒待つ
                                            } else {
                                                distanceCell.textContent = "距離情報取得エラー:再取得中";
                                            }
                                        } else {
                                            distanceCell.textContent = `距離: ${distanceKm} km`;
                                        }
                                    })
                                    .catch(error => {
                                        console.error("Distance calculation error:", error);
                                        distanceCell.textContent = "距離情報取得エラー:再取得中";
                                    });
                                })
                                .catch(error => {
                                    console.error("Shelter coordinates error:", error);
                                    distanceCell.textContent = "避難所の座標取得エラー";
                                });
                        })
                        .catch(error => {
                            console.error("City coordinates error:", error);
                            distanceCell.textContent = "都市の座標取得エラー";
                        });
                }

                // 初回の距離と方位角の取得を試みる
                fetchDistanceAndAzimuth(maxRetries);
            });
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
};