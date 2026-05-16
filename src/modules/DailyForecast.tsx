import useWeatherStore from "../stores/weather";
import Skeleton from "../components/Skeleton";

const DailyForecastSkeleton = () => (
    <section className="grid gap-250 w-full" aria-busy="true">
        <h3 className="text-preset-5 text-neutral-0">Daily forecast</h3>
        <div className="grid grid-cols-3 md:grid-cols-7 gap-200">
            {Array.from({ length: 7 }).map((_, i) => (
                <div
                    key={i}
                    className="flex flex-col items-center gap-200 rounded-12 border border-neutral-600 bg-neutral-800 py-200 px-125 w-full"
                >
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex items-center justify-between w-full">
                        <Skeleton className="h-3 w-6" />
                        <Skeleton className="h-3 w-6" />
                    </div>
                </div>
            ))}
        </div>
    </section>
);

const DailyForecastCard = ({
    maxTemperature,
    minTemperature,
    time,
    weather,
}: {
    time: Date;
    maxTemperature: number;
    minTemperature: number;
    weather: string;
}) => {
    const dayAbbreviation = time.toLocaleDateString("en-US", {
        weekday: "short",
    });

    return (
        <div className="flex flex-col items-center gap-200 justify-center text-neutral-0 rounded-12 border border-neutral-600 bg-neutral-800 py-200 px-125 w-full">
            <span className="text-center text-preset-6">{dayAbbreviation}</span>
            <img
                src={`/icon-${weather}.webp`}
                alt={`${weather[0].toLocaleUpperCase() + weather.slice(1)} weather icon`}
                className="w-15 h-15"
            />
            <div className="flex items-center justify-between w-full">
                <span className="text-preset-7">
                    {maxTemperature.toFixed(0)}°
                </span>
                <span className="text-preset-7">
                    {minTemperature.toFixed(0)}°
                </span>
            </div>
        </div>
    );
};

const DailyForecast = () => {
    const { apiData, weatherLoading } = useWeatherStore();

    if (weatherLoading) return <DailyForecastSkeleton />;

    if (!apiData) return null;

    return (
        <section id="daily_forecast" className="grid gap-250 w-full">
            <h3 className="text-preset-5 text-neutral-0">Daily forecast</h3>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-200">
                {Array.from({ length: 7 }).map((_, i) => (
                    <DailyForecastCard
                        key={i}
                        time={apiData.daily.time[i]}
                        maxTemperature={apiData.daily.maxTemperature[i]}
                        minTemperature={apiData.daily.minTemperature[i]}
                        weather={apiData.daily.weatherCode[i]}
                    />
                ))}
            </div>
        </section>
    );
};

export default DailyForecast;
