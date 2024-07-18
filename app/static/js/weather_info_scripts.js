const city = 'Tokyo';

async function fetchWeatherData() {
    // APIキーを取得
    const apiKeyResponse = await fetch('/get_api_key');
    const apiKeyData = await apiKeyResponse.json();
    const apiKey = apiKeyData.apiKey;

    const todayResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    const todayData = await todayResponse.json();

    const tomorrowResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
    const tomorrowData = await tomorrowResponse.json();

    const todayTemp = todayData.main.temp;
    const todayHumidity = todayData.main.humidity;
    const todayCondition = todayData.weather[0].description;
    const todayIcon = todayData.weather[0].icon;

    const tomorrowTemp = tomorrowData.list[8].main.temp;
    const tomorrowHumidity = tomorrowData.list[8].main.humidity;
    const tomorrowCondition = tomorrowData.list[8].weather[0].description;
    const tomorrowIcon = tomorrowData.list[8].weather[0].icon;

    document.getElementById('temperature-today').textContent = `${todayTemp}°C`;
    document.getElementById('humidity-today').textContent = `Humidity: ${todayHumidity}%`;
    document.getElementById('weather-condition-today').textContent = todayCondition;
    document.getElementById('weather-icon-today').innerHTML = `<img src="http://openweathermap.org/img/wn/${todayIcon}.png" alt="Weather Icon">`;

    document.getElementById('temperature-tomorrow').textContent = `${tomorrowTemp}°C`;
    document.getElementById('humidity-tomorrow').textContent = `Humidity: ${tomorrowHumidity}%`;
    document.getElementById('weather-condition-tomorrow').textContent = tomorrowCondition;
    document.getElementById('weather-icon-tomorrow').innerHTML = `<img src="http://openweathermap.org/img/wn/${tomorrowIcon}.png" alt="Weather Icon">`;
}

fetchWeatherData();