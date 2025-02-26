"use client";
import { useState } from "react";
import Image from "next/image";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
}

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  async function fetchWeather(e: React.FormEvent) {
    e.preventDefault();
    
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "City not found. Please check the spelling and try again."
            : "Failed to fetch weather data"
        );
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <header className="mb-12 mt-8">
        <h1 className="text-3xl font-bold text-center">Weather Finder</h1>
        <p className="text-center mt-2 text-gray-600 dark:text-gray-300">
          Find the current weather for any city
        </p>
      </header>

      <main className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={fetchWeather} className="mb-6">
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              aria-label="City name"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
            >
              {loading ? "Searching..." : "Get Weather"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>

        {weather && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {weather.name}, {weather.sys.country}
              </h2>
              {weather.weather[0].icon && (
                <Image
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  width={64}
                  height={64}
                />
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                <p className="text-gray-500 dark:text-gray-300 text-sm">Temperature</p>
                <p className="text-2xl font-bold">{Math.round(weather.main.temp)}°C</p>
              </div>
              <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                <p className="text-gray-500 dark:text-gray-300 text-sm">Feels Like</p>
                <p className="text-2xl font-bold">{Math.round(weather.main.feels_like)}°C</p>
              </div>
              <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                <p className="text-gray-500 dark:text-gray-300 text-sm">Weather</p>
                <p className="font-semibold capitalize">{weather.weather[0].description}</p>
              </div>
              <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                <p className="text-gray-500 dark:text-gray-300 text-sm">Humidity</p>
                <p className="font-semibold">{weather.main.humidity}%</p>
              </div>
              <div className="col-span-2 text-center p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                <p className="text-gray-500 dark:text-gray-300 text-sm">Wind Speed</p>
                <p className="font-semibold">{weather.wind.speed} m/s</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto py-6 text-center text-gray-500 text-sm">
        <p>Created with Next.js • Weather data from OpenWeatherMap</p>
      </footer>
    </div>
  );
}