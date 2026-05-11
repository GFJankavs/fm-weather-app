import SearchIcon from "./icons/SearchIcon";

const SearchInput = () => (
  <div className="flex items-center gap-200 py-200 px-300 bg-neutral-8 hover:bg-neutral-7 rounded-12 placeholder:text-neutral-2 text-neutral-0 focus-within:outline-2 focus-within:outline-neutral-0 focus-within:outline-offset-2">
    <SearchIcon className="text-neutral-2" />
    <input
      type="text"
      placeholder="Search for a city, e.g., New York"
      className="w-full outline-none"
    />
  </div>
);

export default SearchInput;
