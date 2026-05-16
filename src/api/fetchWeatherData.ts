import { fetchWeatherApi } from "openmeteo";
import type { UnitData, WeatherAPIData } from "../types";
import { getWeatherType } from "../constants";

type WeatherCoords = {
    longitude: number;
    latitude: number;
    temperature: UnitData["temperature"];
    windspeed: UnitData["windspeed"];
    precipitation: UnitData["precipitation"];
};

const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

const fetchWeatherData = async (
    coords: WeatherCoords,
    signal?: AbortSignal,
): Promise<WeatherAPIData | null | undefined> => {
    const params = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],
        hourly: ["temperature_2m", "weather_code"],
        current: [
            "temperature_2m",
            "wind_speed_10m",
            "apparent_temperature",
            "precipitation",
            "weather_code",
            "relative_humidity_2m",
        ],
        timezone: "auto",
        ...(coords.windspeed === "mph" ? { wind_speed_unit: "mph" } : {}),
        ...(coords.temperature === "imperial"
            ? { temperature_unit: "fahrenheit" }
            : {}),
        ...(coords.precipitation === "in"
            ? { precipitation_unit: "inch" }
            : {}),
    };

    const url = "https://api.open-meteo.com/v1/forecast";

    try {
        const responses = await fetchWeatherApi(
            url,
            params,
            undefined,
            undefined,
            undefined,
            { signal },
        );
        const response = responses[0];

        if (!response) return null;

        const utcOffsetSeconds = response.utcOffsetSeconds();
        const daily = response.daily();
        const hourly = response.hourly();
        const current = response.current();

        if (!daily || !hourly || !current) return null;

        type VariableBlock = NonNullable<ReturnType<typeof response.daily>>;

        const toDates = (
            start: number | bigint,
            end: number | bigint,
            interval: number,
        ): Date[] =>
            range(Number(start), Number(end), interval).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000),
            );

        const toSeries = (block: VariableBlock, index: number): number[] =>
            Array.from(block.variables(index)?.valuesArray() ?? []);

        return {
            daily: {
                time: toDates(daily.time(), daily.timeEnd(), daily.interval()),
                weatherCode: toSeries(daily, 0).map(getWeatherType),
                maxTemperature: toSeries(daily, 1),
                minTemperature: toSeries(daily, 2),
            },
            hourly: {
                time: toDates(
                    hourly.time(),
                    hourly.timeEnd(),
                    hourly.interval(),
                ),
                total: toSeries(hourly, 0).length,
                temperature: toSeries(hourly, 0),
                weatherCode: toSeries(hourly, 1).map(getWeatherType),
            },
            current: {
                time: new Date(
                    (Number(current.time()) + utcOffsetSeconds) * 1000,
                ),
                temperature: current.variables(0)?.value() ?? 0,
                windSpeed: current.variables(4)?.value() ?? 0,
                feelsLike: current.variables(2)?.value() ?? 0,
                precipitation: current.variables(3)?.value() ?? 0,
                weatherCode: getWeatherType(current.variables(5)?.value() ?? 0),
                humidity: current.variables(1)?.value() ?? 0,
            },
        };
    } catch (error) {
        // A superseded request was aborted on purpose — not a real failure.
        if (!signal?.aborted) console.error(error);
        return undefined;
    }
};

export default fetchWeatherData;
