import ButtonDropdown from "../ButtonDropdown";

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
  onOptionSelect,
}: {
  onOptionSelect: (option: string) => void;
}) => {
  return (
    <div className="grid gap-050 p-100 rounded-12 bg-neutral-8 border border-neutral-7">
      {daysDropdownOptions.map((day) => (
        <ButtonDropdown key={day} onClick={() => onOptionSelect(day)}>
          {day}
        </ButtonDropdown>
      ))}
    </div>
  );
};

export default DaysDropdown;
