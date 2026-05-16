export type WeatherType =
    | "sunny"
    | "drizzle"
    | "fog"
    | "overcast"
    | "rain"
    | "snow"
    | "storm"
    | "partly-cloudy";

export const WeatherCodes: Record<WeatherType, number[]> = {
    sunny: [0],
    "partly-cloudy": [1, 2],
    overcast: [3],
    fog: [45, 48],
    drizzle: [51, 53, 55, 56, 57],
    rain: [61, 63, 65, 66, 67, 80, 81, 82],
    snow: [71, 73, 75, 77, 85, 86],
    storm: [95, 96, 99],
};

const weatherTypeByCode = new Map<number, WeatherType>(
    (Object.entries(WeatherCodes) as [WeatherType, number[]][]).flatMap(
        ([type, codes]) =>
            codes.map((code): [number, WeatherType] => [code, type]),
    ),
);

// WMO codes outside the mapped set fall back to "sunny".
export const getWeatherType = (code: number): WeatherType =>
    weatherTypeByCode.get(code) ?? "sunny";
