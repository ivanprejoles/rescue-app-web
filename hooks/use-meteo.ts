type WeatherCodeInfo = {
  desc: string;
  detailedDesc: string;
  video: string;
  color: "light" | "dark";
  icon: string;
};

const weatherCodeMap: Record<number, WeatherCodeInfo> = {
  0: {
    desc: "Mostly Sunny",
    detailedDesc:
      "Clear skies dominate with plenty of sunshine shining throughout the day, interrupted only by a few scattered clouds. Perfect conditions for outdoor activities and enjoying warm daylight hours.",
    video: "/videos/sun.mp4",
    color: "light",
    icon: "☀️",
  },
  2: {
    desc: "Partly Cloudy",
    detailedDesc:
      "The sky features a mix of sun and clouds, with intervals of bright sunshine balanced by periods of shade from soft, drifting clouds. It’s a mild day with comfortable weather for most plans.",
    video: "/videos/sun-cloud.mp4",
    color: "light",
    icon: "🌤️",
  },
  3: {
    desc: "Mostly Cloudy",
    detailedDesc:
      "A thick layer of clouds blankets most of the sky, allowing limited sunlight to filter through. The atmosphere feels cool and subdued, with the possibility of overcast conditions lasting throughout the day.",
    video: "/videos/cloud.mp4",
    color: "light",
    icon: "☁️",
  },
  45: {
    desc: "Foggy",
    detailedDesc:
      "Dense fog reduces visibility significantly, creating damp and misty conditions. Caution is advised while traveling as the fog can obscure distant objects and make driving hazardous.",
    video: "/videos/fog.mp4",
    color: "dark",
    icon: "🌫️",
  },
  63: {
    desc: "Moderate Rain",
    detailedDesc:
      "Persistent moderate rain showers are expected, with steady precipitation keeping the ground wet for much of the day. Activities may be interrupted, so carrying suitable rain gear is recommended.",
    video: "/videos/moderate-rain.gif",
    color: "dark",
    icon: "🌧️",
  },
  65: {
    desc: "Heavy Rain",
    detailedDesc:
      "Intense rainfalls are likely, with heavy showers causing steady downpours. Localized flooding may occur, and visibility can be impacted during the heaviest bursts of rain.",
    video: "/videos/heavy-rain.mp4",
    color: "dark",
    icon: "🌧️",
  },
  95: {
    desc: "Thunderstorm",
    detailedDesc:
      "Strong thunderstorms with frequent lightning, heavy rain, and gusty winds dominate the weather. There is a risk of severe conditions including thunderclaps and sudden wind gusts that could cause disruptions.",
    video: "/videos/thunderstorm.mp4",
    color: "dark",
    icon: "⛈️",
  },
};

type MeteoResponse = {
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
    sunrise: string[];
    sunset: string[];
  };
};

// Helper to get closest matching weather info by weather code
function getWeatherInfo(code: number): WeatherCodeInfo {
  const sortedCodes = Object.keys(weatherCodeMap)
    .map(Number)
    .sort((a, b) => a - b);

  let matchedCode = sortedCodes[0];

  for (let i = 0; i < sortedCodes.length; i++) {
    const currentCode = sortedCodes[i];
    if (code === currentCode) {
      matchedCode = currentCode;
      break;
    } else if (code < currentCode) {
      matchedCode = i > 0 ? sortedCodes[i - 1] : sortedCodes[0];
      break;
    }
    if (i === sortedCodes.length - 1 && code > currentCode) {
      matchedCode = currentCode;
    }
  }

  return weatherCodeMap[matchedCode];
}

export type DailyForecast = {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number; // raw weather code from API
  weather: WeatherCodeInfo;
  sunrise: Date;
  sunset: Date;
  windspeed: number;
};

export async function fetchWeeklyWeatherData(
  latitude: number,
  longitude: number
): Promise<DailyForecast[]> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", latitude.toString());
  url.searchParams.set("longitude", longitude.toString());
  url.searchParams.set("current_weather", "true");
  url.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset"
  );
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data: MeteoResponse = await response.json();

  const windspeed = data.current_weather.windspeed;

  const weeklyData: DailyForecast[] = data.daily.time.map((date, idx) => ({
    date,
    tempMax: data.daily.temperature_2m_max[idx],
    tempMin: data.daily.temperature_2m_min[idx],
    weatherCode: data.daily.weathercode[idx],
    weather: getWeatherInfo(data.daily.weathercode[idx]),
    sunrise: new Date(data.daily.sunrise[idx]),
    sunset: new Date(data.daily.sunset[idx]),
    windspeed,
    detailedDesc: getWeatherInfo(data.daily.weathercode[idx]).detailedDesc,
  }));

  return weeklyData;
}
