import ButtonPrimary from "../components/ButtonPrimary";
import SearchInput from "../components/SeachInput";
import fetchWeatherData from "../api/fetchWeatherData";
import useWeatherStore from "../stores/weather";

const WeatherSearch = () => {
    const {
        unitData,
        setApiData,
        setLocationName,
        setWeatherLoading,
        setCoordinates,
        coordinates,
        isApiError,
        setApiError,
    } = useWeatherStore();

    const handleSearchSubmit = async () => {
        if (!coordinates) return;

        if (isApiError) {
            setApiError(false);
        }

        setWeatherLoading(true);

        const { latitude, longitude, city, country } = coordinates;

        const locationFull = `${city}, ${country}`;

        const data = await fetchWeatherData({
            latitude,
            longitude,
            temperature: unitData.temperature,
            windspeed: unitData.windspeed,
            precipitation: unitData.precipitation,
        });

        if (data) {
            setApiData(data);
            setLocationName(locationFull);
        } else if (data === null) {
            setApiData(null);
            setLocationName(null);
        } else {
            setApiError(true);
        }

        setWeatherLoading(false);
    };

    return (
        <section>
            <h1 className="text-preset-2 text-neutral-0 py-600 lg:py-800 text-center">
                How’s the sky looking today?
            </h1>
            <form
                role="search"
                aria-label="City weather search"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearchSubmit();
                }}
                className="grid gap-150 md:flex md:items-center md:justify-center"
            >
                <SearchInput onOptionSelect={setCoordinates} />
                <div>
                    <ButtonPrimary>Search</ButtonPrimary>
                </div>
            </form>
        </section>
    );
};

export default WeatherSearch;
