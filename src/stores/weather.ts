import { create } from "zustand";
import type { LocationCoordinates, UnitData, WeatherAPIData } from "../types";

const metricUnits: UnitData = {
    temperature: "celsius",
    windspeed: "km/h",
    precipitation: "mm",
};

const imperialUnits: UnitData = {
    temperature: "imperial",
    windspeed: "mph",
    precipitation: "in",
};

type Store = {
    apiData: WeatherAPIData | null;
    unitData: UnitData;
    weatherLoading: boolean;
    coordinates: LocationCoordinates | null;
    isApiError: boolean;
    locationName: string | null;
    setLocationName: (name: string | null) => void;
    switchUnits: () => void;
    setUnits: <K extends keyof UnitData>(type: K, value: UnitData[K]) => void;
    setWeatherLoading: (value: boolean) => void;
    setApiData: (value: WeatherAPIData | null) => void;
    setCoordinates: (coords: LocationCoordinates) => void;
    setApiError: (value: boolean) => void;
};

const useWeatherStore = create<Store>()((set) => ({
    apiData: null,
    unitData: metricUnits,
    coordinates: null,
    locationName: null,
    isApiError: false,
    weatherLoading: false,
    setApiError: (value) =>
        set((state) => ({
            ...state,
            isApiError: value,
        })),
    setCoordinates: (coords) =>
        set((state) => ({
            ...state,
            coordinates: coords,
        })),
    setLocationName: (value) =>
        set((state) => ({
            ...state,
            locationName: value,
        })),
    switchUnits: () =>
        set((state) => ({
            unitData:
                state.unitData.temperature === "imperial"
                    ? metricUnits
                    : imperialUnits,
        })),
    setUnits: (type, value) =>
        set((state) => ({
            unitData: {
                ...state.unitData,
                [type]: value,
            },
        })),
    setWeatherLoading: (value) =>
        set((state) => ({
            ...state,
            weatherLoading: value,
        })),
    setApiData: (value) =>
        set((state) => ({
            ...state,
            apiData: value,
        })),
}));

export default useWeatherStore;
export type { UnitData };
