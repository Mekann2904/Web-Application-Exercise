function searchLocation() {
    var location = document.getElementById('location-search').value;
    fetch('/save_location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location: location }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        // データ保存が成功した後にページをリロード
        window.location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}