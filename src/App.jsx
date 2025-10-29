import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found!");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        name,
        country,
        temp: weatherData.current_weather.temperature,
        wind: weatherData.current_weather.windspeed,
        condition: weatherData.current_weather.weathercode,
      });
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-blue-800 text-white px-4">
      <h1 className="text-4xl font-bold mb-6">🌤 Weather Now</h1>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="p-2 rounded text-black w-full sm:w-64"
        />
        <button
          onClick={fetchWeather}
          className="bg-white text-blue-700 px-4 py-2 rounded font-semibold hover:bg-blue-200"
        >
          Get Weather
        </button>
      </div>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-300">{error}</p>}

      {weather && (
        <div className="mt-6 p-6 bg-blue-600 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold">
            {weather.name}, {weather.country}
          </h2>
          <p className="text-lg mt-2">
            🌡 Temperature: <strong>{weather.temp}°C</strong>
          </p>
          <p className="text-lg">
            🌬 Wind Speed: <strong>{weather.wind} km/h</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;