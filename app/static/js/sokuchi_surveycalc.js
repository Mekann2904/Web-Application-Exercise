const city = 'Tokyo';

async function address_search() {
    // 住所から緯度経度を取得
    // 使用例:
    // address_search('東京').then(coords => {
    //     if (coords) {
    //         console.log(`東京の座標: 緯度: ${coords.lat}, 経度: ${coords.lon}`);
    //     }
    // });

    try {
        const response = await fetch(`https://msearch.gsi.go.jp/address-search/AddressSearch?q=${city}`);
        if (!response.ok) {
            throw new Error('ネットワークエラー: ' + response.statusText);
        }
        const data = await response.json();
        if (data.length === 0) {
            throw new Error('指定された住所に対する結果が見つかりませんでした');
        }
        const [lon1, lat2] = data[0].geometry.coordinates;
        console.log(`緯度: ${lat1}, 経度: ${lon2}`);
        return { lat1, lon2 };
    } catch (error) {
        console.error('住所データの取得エラー:', error);
        return null;
    }
}


async function distance_azimuth(lat1, lon1, lat2, lon2) {
    // 距離と方位角を計算
    // // 使用例:
    // distance_azimuth(35.6895, 139.6917, 34.0522, -118.2437).then(result => {
    //     if (result) {
    //         console.log(`距離: ${result.distance}, 方位角1: ${result.azimuth1}, 方位角2: ${result.azimuth2}`);
    //     }
    // });

    try {
        const response = await fetch(`http://vldb.gsi.go.jp/sokuchi/surveycalc/surveycalc/bl2st_calc.pl?latitude1=${lat1}&longitude1=${lon1}&latitude2=${lat2}&longitude2=${lon2}`);
        if (!response.ok) {
            throw new Error('ネットワークエラー: ' + response.statusText);
        }
        const data = await response.json();
        if (!data) {
            throw new Error('計算結果が見つかりませんでした');
        }
        const { distance, azimuth1, azimuth2 } = data;
        console.log(`距離: ${distance}, 方位角1: ${azimuth1}, 方位角2: ${azimuth2}`);
        return { distance, azimuth1, azimuth2 };
    } catch (error) {
        console.error('計算データの取得エラー:', error);
        return null;
    }
}
