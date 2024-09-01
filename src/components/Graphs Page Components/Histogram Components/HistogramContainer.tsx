import AdvancedSearchBarDisplay from "../../Common Components/AdvancedSearchBarDisplay";
import Histogram from "./Histogram";
import { Dataset, DataSetFilters } from "../../../types/Datasets/DatasetTypes";

type HistogramContainerProps = {
  displayingDatasetRows: Dataset;
  handleFormChange: (index: keyof DataSetFilters, event: RegExp) => void;
};
const HistogramContainer: React.FC<HistogramContainerProps> = ({
  displayingDatasetRows,
  handleFormChange,
}: HistogramContainerProps) => {
  return (
    <div className="row">
      <div className="col-12 col-md-4 col-lg-2">
        <AdvancedSearchBarDisplay handleFormChange={handleFormChange} />
      </div>
      {displayingDatasetRows.length > 0 ? (
        <div className="col-12 col-md-8 col-lg-10">
          <Histogram dataset={displayingDatasetRows} />
        </div>
      ) : (
        <div className="col-12 col-md-8 col-lg-10">
          <h2>No Paper matches the selected filters</h2>
        </div>
      )}
    </div>
  );
};

export default HistogramContainer;
