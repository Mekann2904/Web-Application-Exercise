document.addEventListener("DOMContentLoaded", function() {
    fetch('/get_last_location')
        .then(response => response.json())
        .then(data => {
            document.getElementById('location-search').value = data.location;
        })
        .catch(error => console.error('Error fetching location:', error));
});

// function searchLocation() {
//     const location = document.getElementById('location-search').value;
//     if (location) {
//         alert('検索中: ' + location);
//         // ここに位置情報検索の処理を追加する
//         // 例えば、サーバーにリクエストを送信して位置情報を取得する処理など
//     } else {
//         alert('位置情報を入力してください。');
//     }
// }