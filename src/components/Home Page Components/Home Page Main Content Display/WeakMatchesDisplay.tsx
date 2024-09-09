import { useEffect, useState } from "react";
import DataTableDisplay from "./DataTableDisplay";
import {
  DataRow,
  Dataset,
  RowSimilarityScores,
} from "../../../types/Datasets/DatasetTypes";
import { DatasetSystem } from "../../../logic/Dataset Management/DatasetSystem";

interface WeakMatchesDisplayProps {
  datasetSystem: DatasetSystem;
  similaritiesScores: RowSimilarityScores;
  pageTitleOnclick: (row: DataRow) => void;
}

const WeakMatchesDisplay: React.FC<WeakMatchesDisplayProps> = ({
  datasetSystem,
  similaritiesScores,
  pageTitleOnclick,
}) => {
  //state containing list of list of weak matches
  const [weakMatchesDisplayList, setWeakMatchesDisplayList] = useState<
    Dataset[]
  >([]);

  const [shouldDisplayWeakMatches, setShouldDisplayWeakMatches] =
    useState<boolean>(false);

  //when ever similariteis scores change get a new list of weak mathces to display
  useEffect(() => {
    const new_list: Dataset[] =
      datasetSystem.getListOfWeakMatches(similaritiesScores);

    setWeakMatchesDisplayList(new_list);
    if (new_list.length == 0) {
      //dont display, if there are no weak matches
      setShouldDisplayWeakMatches(false);
    } else {
      setShouldDisplayWeakMatches(true);
    }
  }, [datasetSystem, similaritiesScores]);

  return (
    <div>
      {shouldDisplayWeakMatches && (
        <div className="py-5">
          {weakMatchesDisplayList.map((list, index) => (
            <div key={`weakMatch${index}`}>
              <p className="h4">Off by {index + 1} search parameter:</p>

              <DataTableDisplay
                dataDisplayList={list}
                pageTitleOnclick={pageTitleOnclick}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default WeakMatchesDisplay;
