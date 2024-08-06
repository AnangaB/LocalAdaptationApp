import { useEffect, useState } from "react";
import AdvancedSearchBarDisplay from "../../Common Components/AdvancedSearchBarDisplay";
import Histogram from "./Histogram";
import { filterAllRows } from "../../../logic/FilerDataSet";
import { DataSetFilters } from "../../../types/Datasets/DatasetTypes";

type HistogramContainerProps = {
  allRowsList: Record<string, any>[];
};
const HistogramContainer: React.FC<HistogramContainerProps> = ({
  allRowsList,
}: HistogramContainerProps) => {
  const [selectedSearchParams, setSelectedSearchParams] =
    useState<DataSetFilters>({
      Index: /.*/,
      "Citation Key": /.*/,
      Authors: /.*/,
      Year: /.*/,
      Journal: /.*/,
      "Journal ISO Abbreviation": /.*/,
      Title: /.*/,
      Abstract: /.*/,
      "Open Access": /.*/,
      "Reviewer 1": /.*/,
      "Reviewer 2": /.*/,
      Scope: /.*/,
      "Eco-Evo Focus": /.*/,
      Metric: /.*/,
      "Life history": /.*/,
      "Ecological Loci/Traits": /.*/,
      "Additional Loci/Traits": /.*/,
      "Mating system": /.*/,
      Ploidy: /.*/,
      Selection: /.*/,
      "Spatial Structure": /.*/,
      "Population Size": /.*/,
      "Ecological Model": /.*/,
      "Recurrent Mutation": /.*/,
      IBS: /.*/,
      DOI: /.*/,
      ISSN: /.*/,
      url: /.*/,
    });

  //function to call whenever, user makes changes to search menu
  const handleFormChange = (index: keyof DataSetFilters, value: RegExp) => {
    if (String(value) === String("/(?:)/i")) {
      value = /.*/;
    }
    const newData = {
      ...selectedSearchParams,
      [index]: value,
    };
    setSelectedSearchParams(newData);
  };

  //weak search info
  const [rowSimilarityScores, setRowSimilarityScore] = useState<
    Record<number, number>
  >({});

  // stores only the row element from allRowsList that is to be displayed
  const [fullyMatchingRowsList, setFullyMatchingRowsList] = useState<
    Record<string, string>[]
  >([]);

  useEffect(() => {
    const allRowsCopy = [...allRowsList];
    setFullyMatchingRowsList(allRowsCopy);
  }, [allRowsList]);
  //update fullyMatchingRowsList with the search param values

  useEffect(() => {
    filterAllRows(
      allRowsList,
      selectedSearchParams,
      setRowSimilarityScore,
      setFullyMatchingRowsList
    );
  }, [selectedSearchParams]);

  return (
    <div className="row">
      <div className="col-12 col-md-4 col-lg-2">
        <AdvancedSearchBarDisplay handleFormChange={handleFormChange} />
      </div>
      {allRowsList.length > 0 && (
        <div className="col-12 col-md-8 col-lg-10">
          <Histogram allRows={fullyMatchingRowsList} />
        </div>
      )}
    </div>
  );
};

export default HistogramContainer;
