import { useEffect, useMemo, useState } from "react";
import SearchIcon from "./icons/SearchIcon";
import ButtonDropdown from "./ButtonDropdown";
import type { CityAndCountryAPIResponse, LocationOption } from "../types";
import useWeatherStore from "../stores/weather";
import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";

const SearchInput = ({
    onOptionSelect,
}: {
    onOptionSelect: (option: LocationOption) => void;
}) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [locationLoading, setLocationLoading] = useState<boolean>(false);
    const [searchOptions, setSearchOptions] = useState<LocationOption[]>([]);
    const locationName = useWeatherStore((state) => state.locationName);

    useEffect(() => {
        if (searchValue.length === 0) {
            return;
        }

        const controller = new AbortController();

        const timeoutId = setTimeout(() => {
            setLocationLoading(true);

            fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                    searchValue,
                )}`,
                { signal: controller.signal },
            )
                .then((res) => res.json())
                .then((data: CityAndCountryAPIResponse) => {
                    setSearchOptions(
                        (data.results ?? []).map(
                            ({ name, country, latitude, longitude }) => ({
                                city: name,
                                country,
                                latitude,
                                longitude,
                            }),
                        ),
                    );
                    setLocationLoading(false);
                })
                .catch((error: unknown) => {
                    if (
                        error instanceof DOMException &&
                        error.name === "AbortError"
                    )
                        return;
                    setSearchOptions([]);
                    setLocationLoading(false);
                });
        }, 500);

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [searchValue]);

    // Clear the field and dropdown when a fresh location search resolves.
    // `locationName` is only set by a location submit, not by unit-change
    // refetches, so changing units leaves the field untouched.
    useEffect(() => {
        if (!locationName) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearchValue("");
        setSearchOptions([]);
        setIsOpen(false);
    }, [locationName]);

    const filteredOptions = useMemo(() => {
        if (searchOptions.length === 0) return [];

        if (searchValue.length === 0) return searchOptions;

        return searchOptions.filter((option) => {
            const cityAndCountry = `${option.city}, ${option.country}`;

            return cityAndCountry
                .toLocaleLowerCase()
                .includes(searchValue.toLocaleLowerCase());
        });
    }, [searchOptions, searchValue]);

    return (
        <div className="relative w-full md:max-w-131.5 flex items-center gap-200 py-200 px-300 bg-neutral-8 hover:bg-neutral-7 rounded-12 placeholder:text-neutral-2 text-neutral-0 focus-within:outline-2 focus-within:outline-neutral-0 focus-within:outline-offset-2">
            <SearchIcon className="text-neutral-2" />
            <input
                type="text"
                placeholder="Search for a city, e.g., New York"
                className="w-full outline-none"
                value={searchValue}
                aria-label="Search for a city"
                role="combobox"
                aria-autocomplete="list"
                aria-controls="city-search-results"
                aria-expanded={isOpen && searchValue.length > 0}
                onChange={(e) => {
                    setSearchValue(e.target.value);
                    setIsOpen(e.target.value.length > 0);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Escape") setIsOpen(false);
                }}
            />
            {isOpen && searchValue.length > 0 && (
                <div
                    className="absolute top-15 left-0 z-50 w-full"
                    id="dropdown-menu"
                >
                    <div className="grid gap-050 p-100 border border-neutral-7 rounded-12 bg-neutral-8 w-full">
                        {locationLoading ? (
                            <div
                                role="status"
                                aria-live="polite"
                                className="flex items-center gap-125 px-100 py-125"
                            >
                                <TailChase size={20} color="white" />
                                <p className="text-preset-7 text-neutral-0">
                                    Search in progress
                                </p>
                            </div>
                        ) : filteredOptions.length > 0 ? (
                            <div
                                id="city-search-results"
                                role="listbox"
                                aria-label="City search results"
                                className="grid gap-050"
                            >
                                {filteredOptions
                                    .slice(0, 6)
                                    .map((option, index) => (
                                        <ButtonDropdown
                                            key={`${option.city}-${option.country}-${index}`}
                                            role="option"
                                            aria-selected={false}
                                            onClick={() => {
                                                setSearchValue(
                                                    `${option.city}, ${option.country}`,
                                                );
                                                onOptionSelect(option);
                                                setIsOpen(false);
                                            }}
                                        >
                                            {`${option.city}, ${option.country}`}
                                        </ButtonDropdown>
                                    ))}
                            </div>
                        ) : (
                            <p
                                role="status"
                                aria-live="polite"
                                className="flex items-center gap-125 px-100 py-125"
                            >
                                No available options
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchInput;
