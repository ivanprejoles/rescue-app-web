


// useEffect(() => {
//     const lat = 14.5995;
//     const lon = 120.9842;

//     const nearbyPlaces = [
//       { name: "Manila", lat: 14.5995, lon: 120.9842 },
//       { name: "Quezon City", lat: 14.676, lon: 121.0437 },
//       { name: "Makati", lat: 14.5547, lon: 121.0244 },
//       { name: "Pasig", lat: 14.5764, lon: 121.0851 },
//       { name: "Taguig", lat: 14.5176, lon: 121.0509 },
//     ];

//     async function fetchOfficialAlerts(location) {
//       const myHeaders = new Headers();
//       myHeaders.append("X-API-KEY", "5310467310a1ddbab81933ea839dfbb341e36d37"); // <-- Replace with your Serper API key
//       myHeaders.append("Content-Type", "application/json");

//       const prompt = `Provide the latest official weather and disaster alerts for ${location}. Only include information from trusted sources such as PAGASA, NDRRMC, and official government websites. Exclude rumors, social media posts, or unofficial news.`;

//       const raw = JSON.stringify({
//         q: prompt,
//         location: location,
//         gl: "ph", // country code for Philippines
//       });

//       const requestOptions = {
//         method: "POST",
//         headers: myHeaders,
//         body: raw,
//         redirect: "follow",
//       };

//       const response = await fetch(
//         "https://google.serper.dev/search",
//         requestOptions
//       );
//       if (!response.ok) throw new Error("Failed to fetch official alerts");
//       const result = await response.json();

//       const trustedDomains = [
//         "pagasa.dost.gov.ph",
//         "ndrrmc.gov.ph",
//         "phivolcs.dost.gov.ph",
//       ];

//       console.log(result.organic);

//       const filteredAlerts = (result.organic || []).filter((item) => {
//         try {
//           const url = new URL(item.link);
//           return trustedDomains.some((domain) => url.hostname.includes(domain));
//         } catch {
//           return false;
//         }
//       });

//       return filteredAlerts;
//     }

//     async function fetchData() {
//       try {
//         setLoading(true);
//         setError(null);

//         // 1. Fetch main weather data (current + forecast) from Open-Meteo
//         const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&current_weather=true&timezone=auto`;
//         const weatherRes = await fetch(weatherUrl);
//         if (!weatherRes.ok) throw new Error("Failed to fetch weather data");
//         const weatherData = await weatherRes.json();

//         // 2. Fetch current weather for each nearby place
//         const recentSearchesPromises = nearbyPlaces.map(async (place) => {
//           const res = await fetch(
//             `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}&current_weather=true&timezone=auto`
//           );
//           if (!res.ok)
//             throw new Error(`Failed to fetch weather for ${place.name}`);
//           const data = await res.json();

//           const code = data.current_weather?.weathercode ?? 0;
//           const condition = weatherCodeMap[code] || "Unknown";
//           const temp = Math.round(data.current_weather?.temperature ?? 0);

//           return {
//             location: place.name,
//             temp,
//             condition,
//           };
//         });

//         const recentSearches = await Promise.all(recentSearchesPromises);

//         // 3. Fetch official alerts using Serper API
//         const alerts = await fetchOfficialAlerts("Metro Manila, Philippines");

//         // 4. Process daily forecast (next 6 days)
//         const forecast = (weatherData.daily?.time || [])
//           .slice(1, 7)
//           .map((date, i) => {
//             const code = weatherData.daily.weathercode?.[i + 1] ?? 0;
//             return {
//               day: getDayName(date),
//               temp: Math.round(
//                 weatherData.daily.temperature_2m_max?.[i + 1] ?? 0
//               ),
//               icon: null,
//               condition: weatherCodeMap[code] || "Unknown",
//               risk: riskLevel(
//                 weatherData.daily.precipitation_probability_max?.[i + 1] ?? 0
//               ),
//             };
//           });

//         // 5. Process hourly forecast (next 6 hours)
//         const now = new Date();
//         const currentHour = now.getHours();
//         const hourlyForecast = [];
//         for (let i = 0; i < 6; i++) {
//           const idx = currentHour + i;
//           if (!weatherData.hourly.time?.[idx]) break;
//           const code = weatherData.hourly.weathercode?.[idx] ?? 0;
//           hourlyForecast.push({
//             time: getHourLabel(weatherData.hourly.time[idx]),
//             temp: Math.round(weatherData.hourly.temperature_2m?.[idx] ?? 0),
//             icon: null,
//             rain: Math.round(
//               weatherData.hourly.precipitation_probability?.[idx] ?? 0
//             ),
//           });
//         }

//         // 6. Determine status based on alerts
//         const activeAlerts = alerts.length;
//         const dangerous = activeAlerts > 0;
//         const riskLevelValue = dangerous ? 85 : 10;

//         // 7. Set combined state
//         setMockWeatherData({
//           current: {
//             location: "Metro Manila, Philippines",
//             date: new Date().toLocaleDateString("en-US", {
//               weekday: "long",
//               month: "long",
//               day: "numeric",
//             }),
//             temperature: Math.round(weatherData.current_weather.temperature),
//             highTemp: Math.round(
//               weatherData.daily.temperature_2m_max?.[0] ?? 0
//             ),
//             lowTemp: Math.round(weatherData.daily.temperature_2m_min?.[0] ?? 0),
//             condition:
//               weatherCodeMap[weatherData.current_weather.weathercode] ||
//               "Unknown",
//             description:
//               weatherCodeMap[weatherData.current_weather.weathercode] ===
//               "Stormy"
//                 ? "with partly cloudy"
//                 : "",
//             humidity: Math.round(weatherData.current_weather.humidity ?? 0),
//             windSpeed: Math.round(weatherData.current_weather.windspeed ?? 0),
//             visibility: Math.round(weatherData.current_weather.visibility ?? 0),
//             pressure: Math.round(weatherData.current_weather.pressure_msl ?? 0),
//             uvIndex: Math.round(weatherData.current_weather.uv_index ?? 0),
//             feelsLike: Math.round(
//               weatherData.current_weather.apparent_temperature ?? 0
//             ),
//           },
//           forecast,
//           hourlyForecast,
//           recentSearches,
//           alerts,
//           status: {
//             dangerous,
//             riskLevel: riskLevelValue,
//             activeAlerts,
//           },
//         });

//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, []);