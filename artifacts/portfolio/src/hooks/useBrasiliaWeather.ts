import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCache, setCache } from "@/lib/queryCache";

type WeatherState = {
  temperature: number | null;
  description: string;
  isLoading: boolean;
};

const PORTO_ALEGRE_LAT = -30.0346;
const PORTO_ALEGRE_LON = -51.2177;
const CACHE_KEY = "weather:portoalegre";

function mapWeatherCodeToDescription(code: number, t: (key: string) => string): string {
  const allowedCodes = new Set([
    0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75,
    77, 80, 81, 82, 85, 86, 95, 96, 99,
  ]);
  const key = allowedCodes.has(code) ? `weather.codes.${code}` : "weather.codes.default";
  return t(key);
}

export function useBrasiliaWeather() {
  const { t } = useTranslation("home");
  const cached = getCache<{ temperature: number | null; description: string }>(CACHE_KEY);

  const [state, setState] = useState<WeatherState>({
    temperature: cached?.temperature ?? null,
    description: cached?.description ?? t("weather.loading"),
    isLoading: !cached,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${PORTO_ALEGRE_LAT}&longitude=${PORTO_ALEGRE_LON}&current=temperature_2m,weather_code&timezone=America%2FSao_Paulo`,
        );

        if (!response.ok) {
          throw new Error("Weather request failed");
        }

        const data = (await response.json()) as {
          current?: {
            temperature_2m?: number;
            weather_code?: number;
          };
        };

        if (!isMounted) return;

        const temperature = data.current?.temperature_2m ?? null;
        const weatherCode = data.current?.weather_code ?? -1;
        const description = mapWeatherCodeToDescription(weatherCode, t);

        const next = { temperature, description, isLoading: false };
        setState(next);
        setCache(CACHE_KEY, { temperature, description });
      } catch {
        if (!isMounted) return;

        // Keep cached data if available, otherwise show unavailable
        setState((prev) => ({
          temperature: prev.temperature,
          description: prev.description === t("weather.loading") ? t("weather.unavailable") : prev.description,
          isLoading: false,
        }));
      }
    };

    fetchWeather();
    const intervalId = setInterval(fetchWeather, 10 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [t]);

  return state;
}
