import DailyForecast from "./modules/DailyForecast";
import Header from "./modules/Header";
import HeroForecast from "./modules/HeroForecast";
import HourlyForecast from "./modules/HourlyForecast";
import WeatherSearch from "./modules/WeatherSearch";
import useWeatherStore from "./stores/weather";

function App() {
    const { apiData, weatherLoading, isApiError } = useWeatherStore();
    return (
        <div className="min-h-screen w-full bg-neutral-9 px-200 py-200 md:px-300 md:py-300 lg:py-600">
            <main className="mx-auto grid w-full max-w-304 gap-400 lg:gap-600">
                <Header />
                {isApiError ? (
                    <div
                        role="alert"
                        className="flex flex-col items-center gap-300 text-center w-full xl:max-w-[800px] pt-500"
                    >
                        <img
                            src="/icon-error.svg"
                            alt=""
                            className="h-10 w-10"
                        />
                        <h2 className="text-preset-2 text-neutral-0">
                            Something went wrong
                        </h2>
                        <p className="text-preset-5--medium text-neutral-200">
                            We couldn’t connect to the server (API error).
                            Please try again in a few moments.
                        </p>
                        <button
                            type="button"
                            id="retry"
                            onClick={() => window.location.reload()}
                            className="flex items-center justify-center gap-125 px-200 py-150 rounded-8 bg-neutral-800 cursor-pointer"
                        >
                            <img
                                src="/icon-retry.svg"
                                alt=""
                                className="w-4 h-4 text-neutral-0"
                            />
                            <span className="text-preset-7 text-neutral-0">
                                Retry
                            </span>
                        </button>
                    </div>
                ) : (
                    <>
                        <WeatherSearch />
                        <div className="flex flex-col items-center gap-400 lg:flex-row lg:items-start">
                            {apiData || weatherLoading ? (
                                <>
                                    <div className="grid w-full gap-400 lg:flex-1 lg:gap-600 xl:max-w-[800px]">
                                        <HeroForecast />
                                        <DailyForecast />
                                    </div>
                                    <HourlyForecast />
                                </>
                            ) : apiData === undefined && !weatherLoading ? (
                                <div className="flex justify-center">
                                    <span className="text-preset-4 text-neutral-0">
                                        No search result found!
                                    </span>
                                </div>
                            ) : null}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default App;
