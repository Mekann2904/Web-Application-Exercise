const sqlite3 = require('sqlite3').verbose();
const fetch = require('node-fetch');

async function address_search(city) {
    try {
        const response = await fetch(`https://msearch.gsi.go.jp/address-search/AddressSearch?q=${city}`);
        if (!response.ok) {
            throw new Error('ネットワークエラー: ' + response.statusText);
        }
        const data = await response.json();
        if (data.length === 0) {
            throw new Error('指定された住所に対する結果が見つかりませんでした');
        }
        const [lon, lat] = data[0].geometry.coordinates;
        console.log(`緯度: ${lat}, 経度: ${lon}`);
        return { lat, lon };
    } catch (error) {
        console.error('住所データの取得エラー:', error);
        return null;
    }
}

async function distance_azimuth(lat1, lon1, lat2, lon2) {
    try {
        const response = await fetch(`http://vldb.gsi.go.jp/sokuchi/surveycalc/surveycalc/bl2st_calc.pl?latitude1=${lat1}&longitude1=${lon1}&latitude2=${lat2}&longitude2=${lon2}`);
        if (!response.ok) {
            throw new Error('ネットワークエラー: ' + response.statusText);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const distance = doc.querySelector('table tbody tr:nth-child(1) td:nth-child(2)').textContent;
        const azimuth1 = doc.querySelector('table tbody tr:nth-child(2) td:nth-child(2)').textContent;
        const azimuth2 = doc.querySelector('table tbody tr:nth-child(3) td:nth-child(2)').textContent;
        console.log(`距離: ${distance}, 方位角1: ${azimuth1}, 方位角2: ${azimuth2}`);
        return { distance, azimuth1, azimuth2 };
    } catch (error) {
        console.error('計算データの取得エラー:', error);
        return null;
    }
}

function getShelterCoordinates(shelterName) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./shelter.db');
        db.get(`SELECT latitude, longitude FROM shelters WHERE shelter_name = ?`, [shelterName], (err, row) => {
            if (err) {
                reject(err);
            } else if (!row) {
                reject(new Error('指定された避難所が見つかりませんでした'));
            } else {
                resolve({ lat: row.latitude, lon: row.longitude });
            }
        });
        db.close();
    });
}

async function main() {
    const city = 'Tokyo';
    const shelterName = 'Sample Shelter';

    // 東京の緯度経度を取得
    const cityCoords = await address_search(city);
    if (!cityCoords) return;

    // 避難所の緯度経度を取得
    try {
        const shelterCoords = await getShelterCoordinates(shelterName);
        const { lat: lat2, lon: lon2 } = shelterCoords;

        // 距離と方位角を計算
        const result = await distance_azimuth(cityCoords.lat, cityCoords.lon, lat2, lon2);
        if (result) {
            console.log(`距離: ${result.distance}, 方位角1: ${result.azimuth1}, 方位角2: ${result.azimuth2}`);
        }
    } catch (error) {
        console.error('避難所データの取得エラー:', error);
    }
}

main();