import { useMemo, useState } from "react";
import DaysDropdown from "../components/Dropdown/DaysDropdown";
import useWeatherStore from "../stores/weather";
import Skeleton from "../components/Skeleton";
import type { WeatherAPIData } from "../types";

const HourlyForecastSkeleton = () => (
    <section
        className="grid gap-200 text-neutral-0 p-300 rounded-20 bg-neutral-800 w-full lg:max-w-[384px]"
        aria-busy="true"
    >
        <div className="flex items-center justify-between">
            <h3 className="text-preset-5">Hourly forecast</h3>
            <DaysDropdown dayValue={""} onOptionSelect={() => {}} loading />
        </div>
        <div className="grid gap-200 max-h-[592px] overflow-y-auto">
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between py-125 px-150 bg-neutral-700 rounded-8"
                >
                    <div className="flex items-center gap-150">
                        <Skeleton className="h-10 w-10 rounded-full bg-neutral-600" />
                        <Skeleton className="h-3 w-12 bg-neutral-600" />
                    </div>
                    <Skeleton className="h-3 w-8 bg-neutral-600" />
                </div>
            ))}
        </div>
    </section>
);

type HourlyEntry = {
    time: Date;
    temperature: number;
    weatherCode: WeatherAPIData["hourly"]["weatherCode"][number];
};

const HourlyForecastSection = ({
    time,
    temperature,
    weatherCode,
}: HourlyEntry) => (
    <div className="flex items-center justify-between py-125 px-150 bg-neutral-700 rounded-8">
        <div className="flex items-center">
            <img
                src={`/icon-${weatherCode}.webp`}
                alt={weatherCode}
                className="w-10 h-10"
            />
            <span className="text-preset-5 text-neutral-0">
                {time.toLocaleTimeString("en-US", { hour: "numeric" })}
            </span>
        </div>
        <span className="text-preset-7">{Math.round(temperature)}°</span>
    </div>
);

const HourlyForecast = () => {
    const { apiData, weatherLoading } = useWeatherStore();
    const [selectedDay, setSelectedDay] = useState<string>(
        new Date().toLocaleDateString("en-US", {
            weekday: "long",
        }),
    );

    const selectedDayValues = useMemo<HourlyEntry[]>(() => {
        if (!apiData) return [];

        const { time, temperature, weatherCode } = apiData.hourly;

        return time.flatMap((date, index) =>
            date.toLocaleDateString("en-US", { weekday: "long" }) ===
            selectedDay
                ? [
                      {
                          time: date,
                          temperature: temperature[index],
                          weatherCode: weatherCode[index],
                      },
                  ]
                : [],
        );
    }, [apiData, selectedDay]);

    if (weatherLoading) return <HourlyForecastSkeleton />;

    if (!apiData) return null;

    return (
        <section
            id="hourly_forecast"
            className="grid gap-200 text-neutral-0 p-300 rounded-20 bg-neutral-800 w-full lg:max-w-[384px]"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-preset-5">Hourly forecast</h3>
                <DaysDropdown
                    loading={false}
                    dayValue={selectedDay}
                    onOptionSelect={setSelectedDay}
                />
            </div>
            <div
                className="grid gap-200 max-h-[592px] overflow-y-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-0"
                tabIndex={0}
                role="group"
                aria-label="Hourly forecast list, scrollable"
            >
                {selectedDayValues.map((entry) => (
                    <HourlyForecastSection
                        key={entry.time.toISOString()}
                        {...entry}
                    />
                ))}
            </div>
        </section>
    );
};

export default HourlyForecast;
