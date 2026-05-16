import type { WeatherType } from "./constants";

export type CityAndCountryData = {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
};

export type CityAndCountryAPIResponse = {
    results: CityAndCountryData[];
};

export type LocationOption = {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
};

export type WeatherResponse = {
    currentTemperature: number;
    currentMetric: string;
    currentFeelsLike: number;
    minTemperature: number;
    maxTemperature: number;
};

export type UnitData = {
    temperature: "celsius" | "imperial";
    windspeed: "km/h" | "mph";
    precipitation: "mm" | "in";
};

export type WeatherAPIData = {
    daily: {
        time: Date[];
        weatherCode: WeatherType[];
        maxTemperature: number[];
        minTemperature: number[];
    };
    hourly: {
        time: Date[];
        temperature: number[];
        total: number;
        weatherCode: WeatherType[];
    };
    current: {
        time: Date;
        temperature: number;
        feelsLike: number;
        windSpeed: number;
        precipitation: number;
        weatherCode: WeatherType;
        humidity: number;
    };
};

export type LocationCoordinates = {
    city: string;
    country: string;
    longitude: number;
    latitude: number;
};
