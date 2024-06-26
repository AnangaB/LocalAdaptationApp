import { useEffect, useState } from "react";
import DataTableDisplay from "./DataTableDisplay";

interface WeakMatchesDisplayProps {
  allRowsList: Record<string, string>[];
  similaritiesScores: Record<number, number>;
  pageTitleOnclick: (row: Record<string, string>) => void;
}

const WeakMatchesDisplay: React.FC<WeakMatchesDisplayProps> = ({
  allRowsList,
  similaritiesScores,
  pageTitleOnclick,
}) => {
  //state containing list of list of weak matches,
  const [weakMatchesDisplayList, setWeakMatchesDisplayList] = useState<
    Record<string, string>[][]
  >([]);

  const [shouldDisplayWeakMatches, setShouldDisplayWeakMatches] =
    useState<boolean>(false);

  //
  useEffect(() => {
    const values = Object.values(similaritiesScores);
    if (similaritiesScores && values.length > 0) {
      const minScore = Math.min(...values);
      const maxScore = Math.max(...values);

      //if true means currenlty no search param is selected
      if (minScore == maxScore) {
        setShouldDisplayWeakMatches(false);
      } else {
        setShouldDisplayWeakMatches(true);

        let weakMatchLevels = maxScore - minScore;
        weakMatchLevels = Math.min(weakMatchLevels, 5);

        let newWeakMatchesDisplayList: Record<string, string>[][] = [];

        for (let i = 1; i <= weakMatchLevels; i++) {
          const levelScore = maxScore - i;
          let matchesAtLevel: Record<string, string>[] = [];
          for (const row of allRowsList) {
            if (similaritiesScores[Number(row["Index"])] == levelScore) {
              matchesAtLevel.push(row);
            }
          }

          newWeakMatchesDisplayList.push(matchesAtLevel);
        }

        setWeakMatchesDisplayList(newWeakMatchesDisplayList);
      }
    }
  }, [similaritiesScores]);

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
