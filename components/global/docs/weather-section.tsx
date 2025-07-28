import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Cloud,
  CloudRain,
  Globe,
  Search,
  Shield,
  Sun,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

// Map Open-Meteo weather codes to your condition strings and icons
const weatherCodeMap = {
  0: { condition: "Clear", icon: Sun },
  1: { condition: "Mainly Clear", icon: Sun },
  2: { condition: "Partly Cloudy", icon: Cloud },
  3: { condition: "Overcast", icon: Cloud },
  45: { condition: "Fog", icon: Cloud },
  48: { condition: "Depositing Rime Fog", icon: Cloud },
  51: { condition: "Light Drizzle", icon: CloudRain },
  53: { condition: "Moderate Drizzle", icon: CloudRain },
  55: { condition: "Dense Drizzle", icon: CloudRain },
  56: { condition: "Light Freezing Drizzle", icon: CloudRain },
  57: { condition: "Dense Freezing Drizzle", icon: CloudRain },
  61: { condition: "Slight Rain", icon: CloudRain },
  63: { condition: "Moderate Rain", icon: CloudRain },
  65: { condition: "Heavy Rain", icon: CloudRain },
  66: { condition: "Light Freezing Rain", icon: CloudRain },
  67: { condition: "Heavy Freezing Rain", icon: CloudRain },
  71: { condition: "Slight Snow Fall", icon: CloudRain },
  73: { condition: "Moderate Snow Fall", icon: CloudRain },
  75: { condition: "Heavy Snow Fall", icon: CloudRain },
  77: { condition: "Snow Grains", icon: CloudRain },
  80: { condition: "Slight Rain Showers", icon: CloudRain },
  81: { condition: "Moderate Rain Showers", icon: CloudRain },
  82: { condition: "Violent Rain Showers", icon: CloudRain },
  85: { condition: "Slight Snow Showers", icon: CloudRain },
  86: { condition: "Heavy Snow Showers", icon: CloudRain },
  95: { condition: "Thunderstorm", icon: CloudRain },
  96: { condition: "Thunderstorm with slight hail", icon: CloudRain },
  99: { condition: "Thunderstorm with heavy hail", icon: CloudRain },
};

const WeatherSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mockWeatherData, setMockWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const lat = 14.5995;
    const lon = 120.9842;
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&current_weather=true&timezone=auto`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch weather data");
        return res.json();
      })
      .then((data) => {
        if (!data.current_weather) throw new Error("No current weather data");

        const currentWeatherCode = data.current_weather.weathercode;
        const currentCondition =
          weatherCodeMap[currentWeatherCode]?.condition || "Unknown";

        const dateStr = new Date().toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });

        const forecast = (data.daily?.time || []).slice(1, 7).map((date, i) => {
          const code = data.daily.weathercode?.[i + 1] ?? 0;
          return {
            day: getDayName(date),
            temp: Math.round(data.daily.temperature_2m_max?.[i + 1] ?? 0),
            icon: null, // add your icon mapping here
            condition: weatherCodeMap[code]?.condition || "Unknown",
            risk: riskLevel(
              data.daily.precipitation_probability_max?.[i + 1] ?? 0
            ),
          };
        });

        const now = new Date();
        const currentHour = now.getHours();
        const hourlyForecast = [];
        for (let i = 0; i < 6; i++) {
          const idx = currentHour + i;
          const code = data.hourly.weathercode?.[idx] ?? 0;
          hourlyForecast.push({
            time: getHourLabel(data.hourly.time?.[idx] ?? ""),
            temp: Math.round(data.hourly.temperature_2m?.[idx] ?? 0),
            icon: null, // add your icon mapping here
            rain: Math.round(data.hourly.precipitation_probability?.[idx] ?? 0),
          });
        }

        setMockWeatherData({
          current: {
            location: "Metro Manila, Philippines",
            date: dateStr,
            temperature: Math.round(data.current_weather.temperature),
            highTemp: Math.round(data.daily.temperature_2m_max?.[0] ?? 0),
            lowTemp: Math.round(data.daily.temperature_2m_min?.[0] ?? 0),
            condition: currentCondition,
            description:
              currentCondition === "Stormy" ? "with partly cloudy" : "",
            humidity: Math.round(data.current_weather.humidity ?? 0),
            windSpeed: Math.round(data.current_weather.windspeed ?? 0),
            visibility: Math.round(data.current_weather.visibility ?? 0),
            pressure: Math.round(data.current_weather.pressure_msl ?? 0),
            uvIndex: Math.round(data.current_weather.uv_index ?? 0),
            feelsLike: Math.round(
              data.current_weather.apparent_temperature ?? 0
            ),
          },
          forecast,
          hourlyForecast,
          recentSearches: [
            {
              location: "Quezon City, PH",
              temp: 29,
              condition: "Partly Cloudy",
            },
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
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const riskLevel = (precip) => {
    if (precip >= 70) return "high";
    if (precip >= 40) return "medium";
    return "low";
  };

  const getDayName = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { weekday: "long" });

  const getHourLabel = (isoString) => {
    const date = new Date(isoString);
    let hour = date.getHours();
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour} ${ampm}`;
  };

  if (loading) return <div>Loading weather data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!mockWeatherData) return <div>No data available</div>;

  return (
    <>
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-effect rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-12 min-h-[600px]">
              {/* Left Sidebar */}
              <div className="col-span-3 glass-dark p-6 border-r border-white/10">
                <div className="space-y-6">
                  {/* Brand */}
                  <div>
                    <h1 className="text-xl font-bold text-white mb-1">
                      WeatherWise
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>{mockWeatherData.current.location}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      ({mockWeatherData.current.date})
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <div className="text-sm text-gray-400 mb-3">Status</div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-white">+85.6%</span>
                    </div>
                    <div className="glass-effect rounded-lg p-3 border border-red-500/30">
                      <div className="text-red-400 font-medium text-sm">
                        Dangerous
                      </div>
                    </div>
                  </div>

                  {/* Circular Chart */}
                  <div>
                    <div className="relative w-32 h-32 mx-auto">
                      <div className="absolute inset-0 rounded-full border-4 border-gray-600/50"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent transform rotate-45"></div>
                      <div className="absolute inset-4 glass-effect rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">
                            {mockWeatherData.status.riskLevel}
                          </div>
                          <div className="text-xs text-gray-400">Risk</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Select Area */}
                  <div>
                    <div className="text-sm text-gray-400 mb-3">
                      Select Area
                    </div>
                    <div className="relative">
                      <div className="w-full h-24 glass-effect rounded-lg flex items-center justify-center overflow-hidden">
                        <Globe className="h-8 w-8 text-white/40" />
                        {/* Mini location markers */}
                        <div className="absolute top-2 left-4 w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="absolute bottom-3 right-6 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        {mockWeatherData.current.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Main Display */}
              <div className="col-span-6 p-8 flex flex-col justify-center relative">
                <div className="text-center">
                  {/* Main Temperature */}
                  <div className="flex items-baseline justify-center gap-6 mb-8">
                    <span className="text-9xl font-thin text-white tracking-tight">
                      {mockWeatherData.current.temperature}°
                    </span>
                    <div className="text-left">
                      <div className="text-2xl text-gray-300 glass-effect rounded-lg px-3 py-2 mb-3">
                        {mockWeatherData.current.highTemp}°
                      </div>
                      <div className="text-xl text-gray-400">12°</div>
                    </div>
                  </div>

                  {/* Weather Condition */}
                  <div className="mb-12">
                    <h2 className="text-5xl font-thin text-gray-200 mb-3">
                      {mockWeatherData.current.condition}
                    </h2>
                    <p className="text-2xl text-gray-400 font-light">
                      {mockWeatherData.current.description}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="text-gray-300 max-w-md mx-auto mb-16 leading-relaxed">
                    With real time data and advanced technology,
                    <br />
                    we provide reliable forecasts for any location
                    <br />
                    around the world.
                  </div>

                  {/* Weekly Forecast with Curve */}
                  <div className="relative">
                    <div className="flex justify-between items-end mb-6">
                      {mockWeatherData.forecast.map((day, index) => (
                        <div key={index} className="text-center">
                          <div className="text-sm text-gray-400 mb-3">
                            {day.day}
                          </div>
                          <div className="text-2xl font-light text-white">
                            {day.temp}°
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Enhanced curved line overlay */}
                    <div className="absolute bottom-12 left-0 right-0 h-1">
                      <svg
                        className="w-full h-12"
                        viewBox="0 0 600 48"
                        fill="none"
                      >
                        <path
                          d="M0 24 Q150 12 300 24 T600 24"
                          stroke="rgba(59, 130, 246, 0.8)"
                          strokeWidth="3"
                          fill="none"
                        />
                        <circle
                          cx="0"
                          cy="24"
                          r="4"
                          fill="rgba(59, 130, 246, 0.8)"
                        />
                        <circle
                          cx="120"
                          cy="18"
                          r="4"
                          fill="rgba(59, 130, 246, 0.8)"
                        />
                        <circle
                          cx="240"
                          cy="24"
                          r="4"
                          fill="rgba(59, 130, 246, 0.8)"
                        />
                        <circle
                          cx="360"
                          cy="18"
                          r="4"
                          fill="rgba(59, 130, 246, 0.8)"
                        />
                        <circle
                          cx="480"
                          cy="24"
                          r="4"
                          fill="rgba(59, 130, 246, 0.8)"
                        />
                        <circle
                          cx="600"
                          cy="24"
                          r="4"
                          fill="rgba(59, 130, 246, 0.8)"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-span-3 glass-dark p-6 border-l border-white/10">
                <div className="space-y-6">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 glass-effect border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                    />
                  </div>

                  {/* Recently Searched */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-400">
                        Recently Searched
                      </span>
                      <Link
                        href="#"
                        className="text-blue-400 hover:text-blue-300 text-xs"
                      >
                        See All →
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {mockWeatherData.recentSearches.map((location, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 glass-effect rounded-lg hover:bg-white/10 cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 glass-effect rounded-lg flex items-center justify-center">
                              <Cloud className="h-4 w-4 text-white/80" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">
                                {location.temp}°
                              </div>
                              <div className="text-xs text-gray-400">
                                {location.location}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {location.condition}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Emergency Actions */}
                  <div className="space-y-3">
                    <Link href="/report">
                      <Button className="w-full glass-effect text-white hover:bg-red-500/20 border border-red-500/30">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Report Emergency
                      </Button>
                    </Link>
                    <Link href="/apply-rescuer">
                      <Button
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10 glass-effect"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Join as Rescuer
                      </Button>
                    </Link>
                    <Link href="/admin">
                      <Button
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10 glass-effect"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Access
                      </Button>
                    </Link>
                  </div>

                  {/* Emergency Contacts */}
                  <div>
                    <div className="text-sm text-gray-400 mb-3">
                      Emergency Contacts
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 glass-effect rounded border border-red-500/20">
                        <span className="text-sm">Emergency:</span>
                        <span className="font-mono font-bold text-red-400">
                          911
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 glass-effect rounded border border-blue-500/20">
                        <span className="text-sm">TERS:</span>
                        <span className="font-mono font-bold text-blue-400">
                          8888-TERS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Rest of the sections remain the same but with glass effects... */}
      {/* Hourly Forecast Section */}
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
};

export default WeatherSection;
