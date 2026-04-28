import { useEffect, useState } from "react";

type WeatherState = {
  temperature: number | null;
  description: string;
  isLoading: boolean;
};

const BRASILIA_LAT = -15.793889;
const BRASILIA_LON = -47.882778;

function mapWeatherCodeToDescription(code: number): string {
  if (code === 0) return "Ceu limpo";
  if (code === 1) return "Predominantemente limpo";
  if (code === 2) return "Parcialmente nublado";
  if (code === 3) return "Nublado";

  if (code === 45) return "Neblina";
  if (code === 48) return "Neblina com geada";

  if (code === 51) return "Garoa fraca";
  if (code === 53) return "Garoa moderada";
  if (code === 55) return "Garoa intensa";
  if (code === 56) return "Garoa congelante fraca";
  if (code === 57) return "Garoa congelante intensa";

  if (code === 61) return "Chuva fraca";
  if (code === 63) return "Chuva moderada";
  if (code === 65) return "Chuva forte";
  if (code === 66) return "Chuva congelante fraca";
  if (code === 67) return "Chuva congelante forte";

  if (code === 71) return "Neve fraca";
  if (code === 73) return "Neve moderada";
  if (code === 75) return "Neve forte";
  if (code === 77) return "Graos de neve";

  if (code === 80) return "Pancadas de chuva fracas";
  if (code === 81) return "Pancadas de chuva moderadas";
  if (code === 82) return "Pancadas de chuva fortes";
  if (code === 85) return "Pancadas de neve fracas";
  if (code === 86) return "Pancadas de neve fortes";

  if (code === 95) return "Tempestade";
  if (code === 96) return "Tempestade com granizo fraco";
  if (code === 99) return "Tempestade com granizo forte";

  return "Clima variavel";
}

export function useBrasiliaWeather() {
  const [state, setState] = useState<WeatherState>({
    temperature: null,
    description: "Carregando...",
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${BRASILIA_LAT}&longitude=${BRASILIA_LON}&current=temperature_2m,weather_code&timezone=America%2FSao_Paulo`,
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

        setState({
          temperature,
          description: mapWeatherCodeToDescription(weatherCode),
          isLoading: false,
        });
      } catch {
        if (!isMounted) return;

        setState({
          temperature: null,
          description: "Tempo indisponivel",
          isLoading: false,
        });
      }
    };

    fetchWeather();
    const intervalId = setInterval(fetchWeather, 10 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return state;
}
