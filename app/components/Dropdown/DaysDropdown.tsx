import { useEffect, useRef, useState } from "react";
import ButtonDropdown from "../ButtonDropdown";
import DropdownIcon from "../icons/DropdownIcon";

const daysDropdownOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const DaysDropdown = ({
    dayValue,
    onOptionSelect,
    loading,
}: {
    loading: boolean;
    dayValue: string;
    onOptionSelect: (option: string) => void;
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedDay, setSelectedDay] = useState<string>(dayValue);
    const wrapperRef = useRef<HTMLDivElement>(null);

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

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="cursor-pointer flex-center gap-075 py-100 px-125 text-neutral-0 rounded-md bg-neutral-600 text-preset-7 disabled:cursor-not-allowed"
                disabled={loading}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls="days-menu"
                aria-label={`Forecast day: ${selectedDay}`}
            >
                <span>{loading ? "-" : selectedDay}</span>
                <DropdownIcon />
            </button>
            {isOpen && (
                <div
                    id="days-menu"
                    role="listbox"
                    aria-label="Forecast day"
                    className="absolute z-50 top-12 right-0 grid gap-050 p-100 rounded-12 bg-neutral-8 border border-neutral-7"
                >
                    {daysDropdownOptions.map((day) => (
                        <ButtonDropdown
                            key={day}
                            role="option"
                            aria-selected={day === selectedDay}
                            onClick={() => {
                                setSelectedDay(day);
                                onOptionSelect(day);
                                setIsOpen(false);
                            }}
                        >
                            {day}
                        </ButtonDropdown>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DaysDropdown;
