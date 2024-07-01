import React, { useState } from "react";
import "./App.css";

const apiKey = "6b66c4e3fbafa2f6b03e0b4472c4fa0b"; //open weather api key

function App() {
  //Variables for city input, weather data and error messages
  //city input will take the city name
  const [city, setCity] = useState("");
  //weather data will display the weather of city
  const [weatherData, setWeatherData] = useState(null);
  //If the city name  is not given correctly, it'll give error message
  const [error, setError] = useState("");

  const handleSubmit = async (event) => { // This will handle the submission form
    event.preventDefault(); // prevents default form submission behaviour
    if (city) {
      try {
        // fetches weather data of the entered city
        const weatherData = await getWeatherData(city);
        setWeatherData(weatherData);
        setError(""); //clears any previous errors
      } catch (error) { // it'll catch the errors if there are any
        console.error(error);
        setError("Could not fetch weather data");
        setWeatherData(null); //clears any previous weather data
      }
    } else {
      setError("Please enter a city!"); // Displays error if the city input is empty
      setWeatherData(null);
    }
  };


//Fetches data from the open weather api
  const getWeatherData = async (city) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Could not fetch weather data"); //Throws error if the response is not ok
    }
    return await response.json();
  };

  //gets appropriate emoji according to the weather conditions
  const getWeatherEmoji = (weatherId) => {
    switch (true) {
      case weatherId >= 200 && weatherId < 300:
        return "⛈️";
      case weatherId >= 300 && weatherId < 400:
        return "🌧️";
      case weatherId >= 500 && weatherId < 600:
        return "🌧️";
      case weatherId >= 600 && weatherId < 700:
        return "❄️";
      case weatherId >= 700 && weatherId < 800:
        return "🌁";
      case weatherId === 800:
        return "☀️";
      case weatherId >= 801 && weatherId < 810:
        return "☁️";
      default:
        return "❓";
    }
  };

  return (
    <div className="App">
      <form className="weatherForm" onSubmit={handleSubmit}>
        <input
          type="text"
          className="cityInput"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Check Weather</button>
      </form>

      <div className="card" style={{ display: weatherData || error ? "flex" : "none" }}>
        {error && <p className="errorDisplay">{error}</p>}
        {weatherData && (
          <>
            <h1 className="cityDisplay">{weatherData.name}</h1>
            <p className="tempDisplay">{`${(weatherData.main.temp - 273.15).toFixed(1)}°C`}</p>
            <p className="humidityDisplay">{`Humidity: ${weatherData.main.humidity}%`}</p>
            <p className="weatherEmoji">{getWeatherEmoji(weatherData.weather[0].id)}</p>
            <p className="descDisplay">{weatherData.weather[0].description}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
