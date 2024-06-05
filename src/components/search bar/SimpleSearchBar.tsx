import { SearchParamProps } from "../../types/SearchParamProps";

interface SimpleSearchBarProps {
  handleFormChange: (
    index: keyof SearchParamProps,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const SearchBar: React.FC<SimpleSearchBarProps> = ({ handleFormChange }) => {
  return (
    <div key="paperNameSearchDiv" className="m-1 p-2">
      <label htmlFor={`paperName`}>{`Paper Name: `}</label>
      <input
        className="m-1"
        id={`paperNameInput`}
        type="text"
        onChange={(event) =>
          handleFormChange("Paper Name" as keyof SearchParamProps, event)
        }
        placeholder="Paper Name Input"
      ></input>
    </div>
  );
};
export default SearchBar;
