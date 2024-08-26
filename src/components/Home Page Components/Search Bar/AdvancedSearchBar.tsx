import { DataSetFilters } from "../../../types/Datasets/DatasetTypes";
import AdvancedSearchBarDisplay from "../../Common Components/AdvancedSearchBarDisplay";

interface AdvancedSearchBarProps {
  handleFormChange: (index: keyof DataSetFilters, event: RegExp) => void;
}

const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  handleFormChange,
}) => {
  return <AdvancedSearchBarDisplay handleFormChange={handleFormChange} />;
};
export default AdvancedSearchBar;
