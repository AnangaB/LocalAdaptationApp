import { SearchParamProps } from "../../types/SearchParamProps";
import DataTableDisplay from "./DataTableDisplay";

interface DataTableDisplayContainerProps {
  SearchParams: SearchParamProps;
}

const DataTableDisplayContainer: React.FC<DataTableDisplayContainerProps> = ({
  SearchParams,
}) => {
  return (
    <div>
      <DataTableDisplay SearchParams={SearchParams} />
    </div>
  );
};
export default DataTableDisplayContainer;
