window.onload = function() {
    console.log("Window loaded");
    fetch('/get_names')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received:", data);
            let tableBody = document.getElementById('shelter-table').getElementsByTagName('tbody')[0];

            data.forEach(function(name) {
                let row = document.createElement('tr');

                let nameCell = document.createElement('td');
                nameCell.textContent = name;
                row.appendChild(nameCell);

                let distanceCell = document.createElement('td');
                distanceCell.textContent = "ここから## m"; // 距離情報をここに追加します
                row.appendChild(distanceCell);

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
};