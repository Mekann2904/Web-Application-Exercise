window.onload = function() {
    fetch('/get_names')
        .then(response => response.json())
        .then(data => {
            let output = "";
            data.forEach(function(name) {
                output += name + "\n";
            });
            document.getElementById('output').textContent = output;
        });
};