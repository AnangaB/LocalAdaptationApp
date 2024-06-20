import { SearchParamProps } from "../../types/SearchParamProps";
import AdvancedSearchBarDisplay from "../Common Components/AdvancedSearchBarDisplay";

interface AdvancedSearchBarProps {
  handleFormChange: (index: keyof SearchParamProps, event: RegExp) => void;
}

const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  handleFormChange,
}) => {
  return <AdvancedSearchBarDisplay handleFormChange={handleFormChange} />;
};
export default AdvancedSearchBar;
