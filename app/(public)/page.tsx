"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  MapPin,
  AlertTriangle,
  Cloud,
  CloudRain,
  Sun,
  Users,
  Smartphone,
  CheckCircle,
  Droplets,
  Clock,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Map Open-Meteo weather codes to descriptions and video placeholders (same as your original style)
const weatherCodeMap = {
  0: { desc: "Clear sky", video: "☀️ Sunny Video" },
  1: { desc: "Mainly clear", video: "🌤️ Partly Cloudy Video" },
  2: { desc: "Partly cloudy", video: "🌤️ Partly Cloudy Video" },
  3: { desc: "Overcast", video: "☁️ Cloudy Video" },
  45: { desc: "Fog", video: "🌫️ Foggy Video" },
  48: { desc: "Depositing rime fog", video: "🌫️ Foggy Video" },
  51: { desc: "Light drizzle", video: "🌦️ Drizzle Video" },
  53: { desc: "Moderate drizzle", video: "🌦️ Drizzle Video" },
  55: { desc: "Dense drizzle", video: "🌧️ Rain Video" },
  61: { desc: "Slight rain", video: "🌧️ Rain Video" },
  63: { desc: "Moderate rain", video: "🌧️ Rain Video" },
  65: { desc: "Heavy rain", video: "🌧️ Rain Video" },
  71: { desc: "Slight snow", video: "❄️ Snow Video" },
  73: { desc: "Moderate snow", video: "❄️ Snow Video" },
  75: { desc: "Heavy snow", video: "❄️ Snow Video" },
  95: { desc: "Thunderstorm", video: "⛈️ Thunderstorm Video" },
  99: { desc: "Heavy thunderstorm with hail", video: "⛈️ Thunderstorm Video" },
};

// Mock weather data
const mockWeatherData = {
  current: {
    location: "Metro Manila, Philippines",
    date: "Friday, January 4",
    temperature: 28,
    highTemp: 32,
    lowTemp: 24,
    condition: "Stormy",
    description: "with partly cloudy",
    humidity: 85,
    windSpeed: 15,
    visibility: 8,
    pressure: 1008,
    uvIndex: 6,
    feelsLike: 32,
  },
  forecast: [
    { day: "Sunday", temp: 30, icon: Sun, condition: "Sunny", risk: "low" },
    {
      day: "Monday",
      temp: 28,
      icon: Cloud,
      condition: "Cloudy",
      risk: "medium",
    },
    {
      day: "Tuesday",
      temp: 26,
      icon: CloudRain,
      condition: "Rainy",
      risk: "high",
    },
    {
      day: "Wednesday",
      temp: 24,
      icon: CloudRain,
      condition: "Stormy",
      risk: "high",
    },
    {
      day: "Thursday",
      temp: 27,
      icon: Cloud,
      condition: "Cloudy",
      risk: "medium",
    },
    { day: "Friday", temp: 29, icon: Sun, condition: "Sunny", risk: "low" },
  ],
  hourlyForecast: [
    { time: "12 PM", temp: 28, icon: Cloud, rain: 20 },
    { time: "1 PM", temp: 29, icon: CloudRain, rain: 60 },
    { time: "2 PM", temp: 27, icon: CloudRain, rain: 80 },
    { time: "3 PM", temp: 26, icon: CloudRain, rain: 90 },
    { time: "4 PM", temp: 25, icon: CloudRain, rain: 70 },
    { time: "5 PM", temp: 26, icon: Cloud, rain: 40 },
  ],
  recentSearches: [
    { location: "Quezon City, PH", temp: 29, condition: "Partly Cloudy" },
    { location: "Cebu City, PH", temp: 31, condition: "Sunny" },
    { location: "Davao City, PH", temp: 27, condition: "Light Rain" },
  ],
  alerts: [
    {
      id: 1,
      type: "Typhoon Watch",
      severity: "high",
      message:
        "Tropical Depression developing east of Luzon. Monitor for potential typhoon formation.",
      validUntil: "2024-01-20 18:00",
    },
    {
      id: 2,
      type: "Flood Warning",
      severity: "medium",
      message:
        "Heavy rainfall expected in low-lying areas. Prepare for possible flooding.",
      validUntil: "2024-01-18 12:00",
    },
  ],
  status: {
    dangerous: true,
    riskLevel: 85,
    activeAlerts: 3,
  },
};

const features = [
  {
    icon: MapPin,
    title: "Real-time Location Tracking",
    description:
      "Precise GPS tracking to locate people in need during emergencies",
  },
  {
    icon: AlertTriangle,
    title: "Instant Emergency Reporting",
    description:
      "Quick and easy emergency reporting with photo/video attachments",
  },
  {
    icon: Users,
    title: "Coordinated Response",
    description:
      "Efficient coordination between emergency responders and affected individuals",
  },
  {
    icon: Shield,
    title: "Verified Response Teams",
    description: "All rescue teams are verified and trained professionals",
  },
];

// Floating animation component
const FloatingCard = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <div
    className="animate-float"
    style={{
      animationDelay: `${delay}s`,
      animationDuration: "6s",
      animationIterationCount: "infinite",
      animationTimingFunction: "ease-in-out",
    }}
  >
    {children}
  </div>
);

// Gradient background component
const GradientBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
    <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
  </div>
);

// Simulated video component based on weather code (replace with your actual video component)
function WeatherVideo({ code }) {
  const weather = weatherCodeMap[code] || {
    desc: "Unknown",
    video: "🌈 Default Video",
  };
  return (
    <div
      style={{
        fontSize: "5rem",
        textAlign: "center",
        margin: "2rem 0",
        userSelect: "none",
      }}
      aria-label={`Weather video placeholder: ${weather.desc}`}
    >
      {weather.video}
    </div>
  );
}

// Geocode city to lat/lon using OpenStreetMap Nominatim API (free and no key required)
async function geocodeCity(city) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    city
  )}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data && data.length > 0) {
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
      display_name: data[0].display_name,
    };
  }
  throw new Error("Location not found");
}

export default function WeatherWiseDashboard() {
  // Default location: Brooklyn, NY (same as your original mock data)
  const [location, setLocation] = useState({
    latitude: 40.6782,
    longitude: -73.9442,
    name: "Brooklyn, NY",
  });

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cityInput, setCityInput] = useState("");

  // Fetch weather data from Open-Meteo API
  async function fetchWeather(lat, lon) {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=America/New_York`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch weather data");
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  // Initial fetch and refresh every 10 minutes
  useEffect(() => {
    fetchWeather(location.latitude, location.longitude);
    const interval = setInterval(() => {
      fetchWeather(location.latitude, location.longitude);
    }, 10 * 60 * 1000); // 10 minutes
    return () => clearInterval(interval);
  }, [location]);

  // Handle city search to update location
  async function handleSearch(e) {
    e.preventDefault();
    if (!cityInput.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const loc = await geocodeCity(cityInput.trim());
      setLocation({
        latitude: loc.latitude,
        longitude: loc.longitude,
        name: loc.display_name,
      });
      setCityInput("");
    } catch (err) {
      setError("City not found. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "low":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-500 bg-red-500/10 text-red-400";
      case "medium":
        return "border-yellow-500 bg-yellow-500/10 text-yellow-400";
      case "low":
        return "border-green-500 bg-green-500/10 text-green-400";
      default:
        return "border-gray-500 bg-gray-500/10 text-gray-400";
    }
  };

  return (
    <>
      <main
        style={{
          maxWidth: 600,
          margin: "2rem auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1>WeatherWise Dashboard</h1>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Enter city name"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            style={{ padding: 8, width: "70%", fontSize: 16 }}
            aria-label="City name"
          />
          <button
            type="submit"
            style={{ padding: "8px 16px", marginLeft: 8, fontSize: 16 }}
          >
            Search
          </button>
        </form>

        {/* Location */}
        <h2>{location.name}</h2>

        {/* Loading/Error */}
        {loading && <p>Loading weather data...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Current Weather */}
        {weather && weather.current_weather && (
          <>
            <div style={{ fontSize: "3rem", fontWeight: "bold" }}>
              {weather.current_weather.temperature}°C
            </div>
            <div style={{ fontSize: "1.5rem", marginBottom: 20 }}>
              {weatherCodeMap[weather.current_weather.weathercode]?.desc ||
                "Unknown weather"}
            </div>

            {/* Weather Video */}
            <WeatherVideo code={weather.current_weather.weathercode} />

            {/* 7-Day Forecast */}
            <h3>7-Day Forecast</h3>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {weather.daily.time.map((date, idx) => (
                <div
                  key={date}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    padding: 10,
                    width: "13%",
                    textAlign: "center",
                    fontSize: 14,
                  }}
                >
                  <div>
                    {new Date(date).toLocaleDateString(undefined, {
                      weekday: "short",
                    })}
                  </div>
                  <div style={{ fontWeight: "bold" }}>
                    {weather.daily.temperature_2m_max[idx]}° /{" "}
                    {weather.daily.temperature_2m_min[idx]}°
                  </div>
                  <div>
                    {weatherCodeMap[weather.daily.weathercode[idx]]?.desc ||
                      "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Hourly Forecast
        </h2>
        <div className="glass-effect rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mockWeatherData.hourlyForecast.map((hour, index) => (
              <FloatingCard key={index} delay={index * 0.1}>
                <div className="text-center p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
                  <div className="text-sm text-gray-400 mb-2">{hour.time}</div>
                  <hour.icon className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                  <div className="text-lg font-medium mb-1">{hour.temp}°</div>
                  <div className="flex items-center justify-center gap-1 text-xs text-blue-400">
                    <Droplets className="h-3 w-3" />
                    <span>{hour.rain}%</span>
                  </div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </div>

      {/* Weather Alerts Section */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Active Weather Alerts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockWeatherData.alerts.map((alert, index) => (
            <FloatingCard key={alert.id} delay={index * 0.3}>
              <div
                className={`glass-effect rounded-2xl p-6 border ${getSeverityColor(
                  alert.severity
                )}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-current" />
                    <h4 className="font-bold text-lg">{alert.type}</h4>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-current text-current glass-effect"
                  >
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm mb-4 text-gray-300">{alert.message}</p>
                <div className="flex items-center gap-2 text-xs opacity-70">
                  <Clock className="h-3 w-3" />
                  <span>Valid until {alert.validUntil}</span>
                </div>
              </div>
            </FloatingCard>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Emergency Response Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FloatingCard key={index} delay={index * 0.2}>
              <div className="glass-effect rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 h-full">
                <div className="p-3 glass-effect rounded-xl w-fit mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            </FloatingCard>
          ))}
        </div>
      </div>

      {/* App Download Section */}
      <div className="container mx-auto px-6 py-12">
        <FloatingCard delay={0}>
          <div className="glass-effect rounded-3xl p-12 text-center">
            <Smartphone className="h-16 w-16 mx-auto mb-6 text-blue-400" />
            <h2 className="text-4xl font-bold mb-4 text-white">
              Download TERS Mobile App
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get real-time weather alerts, emergency reporting, and instant
              access to rescue services on your mobile device.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button
                size="lg"
                className="glass-effect text-white hover:bg-green-500/20 border border-green-500/30 flex-1"
              >
                <Download className="h-5 w-5 mr-2" />
                Download for Android
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 glass-effect flex-1"
              >
                <Download className="h-5 w-5 mr-2" />
                Download for iOS
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Version 1.0.0</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Updated January 15, 2024</span>
              </div>
            </div>
          </div>
        </FloatingCard>
      </div>
    </>
  );
}
