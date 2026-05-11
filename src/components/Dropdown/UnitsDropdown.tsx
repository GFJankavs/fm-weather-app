import { useState } from "react";
import ButtonDropdown from "../ButtonDropdown";

const unitsDropdownOptions = [
  {
    title: "Temperature",
    options: ["Celsius (°C)", "Fahrenheit (°F)"],
  },
  {
    title: "Wind Speed",
    options: ["km/h", "mph"],
  },
  {
    title: "Precipitation",
    options: ["Milimeters (mm)", "Inches (in)"],
  },
];

const UnitDropdownSection = ({
  title,
  options,
  selectedOption,
  onOptionSelect,
}: {
  title: string;
  options: string[];
  selectedOption: string;
  onOptionSelect: (option: string) => void;
}) => (
  <div className="grid gap-100">
    <span className="pt-050 pl-100 text-preset-8 text-neutral-300">
      {title}
    </span>
    <div className="grid">
      {options.map((option) => (
        <ButtonDropdown
          key={option}
          checked={option === selectedOption}
          onClick={() => onOptionSelect(option)}
        >
          {option}
        </ButtonDropdown>
      ))}
    </div>
  </div>
);

const UnitsDropdown = () => {
  const [selectedUnits, setSelectedUnits] = useState({
    temperature: "Celsius (°C)",
    windspeed: "km/h",
    precipitation: "Milimeters (mm)",
  });

  const handleSwitchUnits = () => {
    setSelectedUnits((prev) => ({
      temperature:
        prev.temperature === "Celsius (°C)"
          ? "Fahrenheit (°F)"
          : "Celsius (°C)",
      windspeed: prev.windspeed === "km/h" ? "mph" : "km/h",
      precipitation:
        prev.precipitation === "Milimeters (mm)"
          ? "Inches (in)"
          : "Milimeters (mm)",
    }));
  };

  return (
    <div className="grid gap-050 py-075 px-100 border border-neutral-6 bg-neutral-8 rounded-12">
      <ButtonDropdown onClick={handleSwitchUnits}>
        Switch to Imperial
      </ButtonDropdown>
      <div className="grid gap-050">
        {unitsDropdownOptions.map(({ title, options }, index) => (
          <div key={title}>
            <UnitDropdownSection
              title={title}
              options={options}
              selectedOption={
                selectedUnits[
                  title
                    .toLowerCase()
                    .replace(" ", "") as keyof typeof selectedUnits
                ]
              }
              onOptionSelect={(option) =>
                setSelectedUnits((prev) => ({
                  ...prev,
                  [title.toLowerCase().replace(" ", "")]: option,
                }))
              }
            />
            {index < unitsDropdownOptions.length - 1 && (
              <div
                key={`${index}-divider`}
                className="border-t border-neutral-6"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitsDropdown;
