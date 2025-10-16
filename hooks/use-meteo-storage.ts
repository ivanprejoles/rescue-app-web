import { create } from "zustand";

type WeatherCodeInfo = {
  desc: string;
  video: string;
  detailedDesc: string;
  color: "light" | "dark";
  icon: string;
};

type DailyForecast = {
  date: string;
  tempMax: number;
  tempMin: number;
  weather: WeatherCodeInfo;
  sunrise: Date;
  sunset: Date;
  windspeed: number | null;
};

type WeatherState = {
  weekly: DailyForecast[];
  selectedDayIndex: number;
  selectDay: (index: number) => void;
  setWeeklyData: (weekly: DailyForecast[]) => void;
  currentDay: () => DailyForecast | null;
};

export const useWeatherStore = create<WeatherState>((set, get) => ({
  weekly: [],
  selectedDayIndex: 0,

  setWeeklyData: (weekly) => {
    set({ weekly, selectedDayIndex: 0 });
  },

  selectDay: (index: number) => {
    set(() => ({
      selectedDayIndex: index,
    }));
  },

  currentDay: () => {
    const { weekly, selectedDayIndex } = get();
    if (weekly.length === 0) return null;
    return weekly[selectedDayIndex];
  },
}));
