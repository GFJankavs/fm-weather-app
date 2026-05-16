import useWeatherStore from "../stores/weather";

const HeroForecastSkeleton = () => (
    <section className="grid gap-250 w-full" aria-busy="true">
        <div
            role="status"
            className="flex flex-col items-center justify-center gap-200 w-full min-h-50 md:min-h-71.5 rounded-20 bg-neutral-800"
        >
            <img
                src="/icon-loading.svg"
                alt=""
                className="w-17.5 h-auto animate-spin duration-300"
            />
            <span className="text-preset-6 text-neutral-200">
                Loading weather…
            </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-200">
            <div className="p-250 rounded-12 bg-neutral-800 grid gap-300 text-neutral-0">
                <span className="text-preset-6">Feels like</span>
                <span className="text-preset-3">-</span>
            </div>
            <div className="p-250 rounded-12 bg-neutral-800 grid gap-300 text-neutral-0">
                <span className="text-preset-6">Humidity</span>
                <span className="text-preset-3">-</span>
            </div>
            <div className="p-250 rounded-12 bg-neutral-800 grid gap-300 text-neutral-0">
                <span className="text-preset-6">Wind</span>
                <span className="text-preset-3">-</span>
            </div>
            <div className="p-250 rounded-12 bg-neutral-800 grid gap-300 text-neutral-0">
                <span className="text-preset-6">Precipitation</span>
                <span className="text-preset-3">-</span>
            </div>
        </div>
    </section>
);

const formatDate = (dateString: Date | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
};

const HeroForecast = () => {
    const { apiData, locationName, unitData, weatherLoading } =
        useWeatherStore();

    if (weatherLoading) return <HeroForecastSkeleton />;

    const formattedDate = formatDate(apiData?.current.time ?? undefined);

    return (
        <section className="grid gap-250 w-full" id="weather_today">
            <div className="relative w-full min-h-50 md:min-h-71.5">
                <picture className="py-10 px-6">
                    <source
                        media="(min-width: 768px)"
                        srcSet="/bg-today-large.svg"
                    />
                    <img
                        src="/bg-today-small.svg"
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover rounded-20"
                    />
                </picture>
                <div
                    id="hero_info"
                    className="absolute inset-0 z-10 flex flex-col md:flex-row items-center justify-center md:justify-between md:gap-200 py-400 px-6.5 text-neutral-0"
                >
                    <div className="max-md:text-center grid gap-150">
                        <h3 className="text-preset-4">{locationName}</h3>
                        <h5 className="text-preset-6 opacity-80">
                            {formattedDate}
                        </h5>
                    </div>
                    <div className="flex items-center gap-250">
                        <img
                            src={`/icon-${apiData?.current.weatherCode}.webp`}
                            alt={
                                apiData
                                    ? `${apiData.current.weatherCode} weather`
                                    : "Current weather"
                            }
                            className="w-30 h-30"
                        />
                        <h1 className="text-preset-1">
                            {`${apiData?.current.temperature.toFixed(0)}${unitData.temperature === "celsius" ? "°" : ""}`}
                        </h1>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-200">
                <div className="p-250 rounded-12 bg-neutral-800 grid gap-300 text-neutral-0">
                    <span className="text-preset-6">Feels like</span>
                    <span className="text-preset-3">
                        {apiData?.current.feelsLike.toFixed(0)}
                    </span>
                </div>
                <div className="p-250 rounded-12 bg-neutral-800 grid gap-300 text-neutral-0">
                    <span className="text-preset-6">Humidity</span>
                    <span className="text-preset-3">
                        {apiData?.current.humidity.toFixed(0)}%
                    </span>
                </div>
                <div className="p-250 rounded-12 bg-neutral-800 grid gap-300 text-neutral-0">
                    <span className="text-preset-6">Wind</span>
                    <span className="text-preset-3">{`${apiData?.current.windSpeed} ${unitData.windspeed}`}</span>
                </div>
                <div className="p-250 rounded-12 bg-neutral-800 grid gap-300 text-neutral-0">
                    <span className="text-preset-6">Precipitation</span>
                    <span className="text-preset-3">{`${apiData?.current.precipitation.toFixed(0)} ${unitData.precipitation}`}</span>
                </div>
            </div>
        </section>
    );
};

export default HeroForecast;
