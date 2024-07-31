async function fetchWeatherData() {
    try {
        // 最後の位置情報をローマ字で取得
        const lastLocationResponse = await fetch('/get_location_romaji');
        const lastLocationData = await lastLocationResponse.json();
        if (lastLocationData.error) {
            throw new Error(lastLocationData.error);
        }
        const city = lastLocationData.location_romaji;

        console.log('City in Romaji:', city);

        // APIキーを取得
        const apiKeyResponse = await fetch('/get_api_key');
        const apiKeyData = await apiKeyResponse.json();
        const apiKey = apiKeyData.apiKey;

        const todayResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        if (!todayResponse.ok) {
            const errorDetails = await todayResponse.text();
            throw new Error(`Weather data fetch failed: ${todayResponse.statusText} - ${errorDetails}`);
        }
        const todayData = await todayResponse.json();
        console.log('Today Data:', todayData);

        const tomorrowResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
        if (!tomorrowResponse.ok) {
            const errorDetails = await tomorrowResponse.text();
            throw new Error(`Forecast data fetch failed: ${tomorrowResponse.statusText} - ${errorDetails}`);
        }
        const tomorrowData = await tomorrowResponse.json();
        console.log('Tomorrow Data:', tomorrowData);

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
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weather-error-message').textContent = "※自治体名が必要です(都道府県市区町村から少なくとも１つ)";
    }
}

fetchWeatherData();