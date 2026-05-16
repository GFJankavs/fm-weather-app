import { useEffect, useRef, useState } from "react";
import ButtonDropdown from "../ButtonDropdown";
import UnitsIcon from "../icons/UnitsIcon";
import DropdownIcon from "../icons/DropdownIcon";
import useWeatherStore from "../../stores/weather";
import { type UnitData } from "../../types";
import fetchWeatherData from "../../api/fetchWeatherData";

type UnitGroup = {
    [K in keyof UnitData & string]: {
        id: K;
        title: string;
        options: { label: string; value: UnitData[K] }[];
    };
}[keyof UnitData & string];

const unitsDropdownOptions: UnitGroup[] = [
    {
        id: "temperature",
        title: "Temperature",
        options: [
            { label: "Celsius (°C)", value: "celsius" },
            { label: "Fahrenheit (°F)", value: "imperial" },
        ],
    },
    {
        id: "windspeed",
        title: "Wind Speed",
        options: [
            { label: "km/h", value: "km/h" },
            { label: "mph", value: "mph" },
        ],
    },
    {
        id: "precipitation",
        title: "Precipitation",
        options: [
            { label: "Milimeters (mm)", value: "mm" },
            { label: "Inches (in)", value: "in" },
        ],
    },
];

const UnitDropdownSection = ({
    title,
    options,
    selectedValue,
    onOptionSelect,
}: {
    title: string;
    options: { label: string; value: string }[];
    selectedValue: string;
    onOptionSelect: (value: string) => void;
}) => (
    <div className="grid gap-100">
        <span className="pt-050 pl-100 text-preset-8 text-neutral-300">
            {title}
        </span>
        <div className="grid gap-050">
            {options.map(({ label, value }) => (
                <ButtonDropdown
                    key={value}
                    checked={value === selectedValue}
                    onClick={() => onOptionSelect(value)}
                >
                    {label}
                </ButtonDropdown>
            ))}
        </div>
    </div>
);

const UnitsDropdown = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const {
        unitData,
        switchUnits,
        setUnits,
        setWeatherLoading,
        coordinates,
        setApiData,
        weatherLoading,
    } = useWeatherStore();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    const refetchWithCurrentUnits = async () => {
        if (!coordinates) return;

        // Cancel any in-flight request so a slower earlier response can't
        // overwrite the result of the unit the user actually settled on.
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setWeatherLoading(true);

        try {
            const { latitude, longitude } = coordinates;
            // Read the freshly-applied units from the store: the `unitData`
            // closed over by this render is stale immediately after
            // setUnits/switchUnits (Zustand's set is synchronous).
            const { unitData: units } = useWeatherStore.getState();

            const data = await fetchWeatherData(
                {
                    latitude,
                    longitude,
                    temperature: units.temperature,
                    windspeed: units.windspeed,
                    precipitation: units.precipitation,
                },
                controller.signal,
            );

            if (controller.signal.aborted) return;

            if (data) {
                setApiData(data);
            }
        } catch (error) {
            if (!controller.signal.aborted) console.error(error);
        } finally {
            // Leave loading on if a newer request superseded this one — it
            // owns the loading lifecycle now.
            if (!controller.signal.aborted) setWeatherLoading(false);
        }
    };

    const handleUnitDropdownSelection = (value: string, id: string) => {
        setUnits(id as keyof UnitData, value as UnitData[keyof UnitData]);
        void refetchWithCurrentUnits();
    };

    const handleSwitchUnits = () => {
        switchUnits();
        void refetchWithCurrentUnits();
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    const isImperial = unitData.temperature === "imperial";

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                type="button"
                className="cursor-pointer flex-center gap-075 py-100 px-125 text-neutral-0 rounded-md bg-neutral-800"
                onClick={() => setIsOpen((prev) => !prev)}
                disabled={weatherLoading}
                aria-haspopup="true"
                aria-controls="units-menu"
                aria-label="Units settings"
            >
                <UnitsIcon />
                <span>Units</span>
                <DropdownIcon />
            </button>

            {isOpen && (
                <div
                    id="units-menu"
                    role="group"
                    aria-label="Unit settings"
                    className="absolute z-50 top-12 right-0 w-53.5 grid gap-050 py-075 px-100 border border-neutral-6 bg-neutral-8 rounded-12"
                >
                    <ButtonDropdown
                        onClick={() => {
                            handleSwitchUnits();
                            setIsOpen(false);
                        }}
                    >
                        {`Switch to ${isImperial ? "Metric" : "Imperial"}`}
                    </ButtonDropdown>
                    <div className="grid gap-300">
                        {unitsDropdownOptions.map(
                            ({ id, title, options }, index) => (
                                <div key={id}>
                                    <UnitDropdownSection
                                        title={title}
                                        options={options}
                                        selectedValue={unitData[id]}
                                        onOptionSelect={(value) => {
                                            handleUnitDropdownSelection(
                                                value,
                                                id,
                                            );
                                            setIsOpen(false);
                                        }}
                                    />
                                    {index <
                                        unitsDropdownOptions.length - 1 && (
                                        <div className="border-t border-neutral-6" />
                                    )}
                                </div>
                            ),
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnitsDropdown;
