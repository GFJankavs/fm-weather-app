import DaysDropdown from "./components/Dropdown/DaysDropdown";

function App() {
  return (
    <div className="p-500 w-screen min-h-screen bg-neutral-9">
      <DaysDropdown onOptionSelect={(option) => console.log(option)} />
    </div>
  );
}

export default App;
