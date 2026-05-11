import { forwardRef } from "react";
import ButtonDropdown from "../ButtonDropdown";

const SearchDropdown = forwardRef<
  HTMLDivElement,
  {
    dropdownOptions: string[];
    onDropdownOptionSelect: (option: string) => void;
  }
>(({ onDropdownOptionSelect, dropdownOptions }, ref) => {
  <div
    ref={ref}
    className="grid gap-050 p-100 border border-neutral-7 rounded-12 bg-neutral-8"
  >
    {dropdownOptions.map((option) => (
      <ButtonDropdown
        key={option}
        onClick={() => onDropdownOptionSelect(option)}
      >
        {option}
      </ButtonDropdown>
    ))}
  </div>;
});

export default SearchDropdown;
