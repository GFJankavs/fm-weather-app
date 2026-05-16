import UnitsDropdown from "../components/Dropdown/UnitsDropdown";

const Header = () => {
    return (
        <header className="flex items-center justify-between">
            <img src="/logo.svg" alt="Weather Now Logo" className="w-34.25" />
            <UnitsDropdown />
        </header>
    );
};

export default Header;
