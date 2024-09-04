interface TreeControlsBarProps {
  paperNameBeingShownInTree: string;
  paperNameBeingShownInAdditionalInfo: string;
  showOriginalPaperInfoOnClick: () => void;
  viewDisplayedPaperTreeOnClick: () => void;
}

const TreeControlsBar: React.FC<TreeControlsBarProps> = ({
  paperNameBeingShownInTree,
  paperNameBeingShownInAdditionalInfo,
  showOriginalPaperInfoOnClick,
  viewDisplayedPaperTreeOnClick,
}) => {
  return (
    <div className="container-fluid">
      <div className="row p-1">
        <div className="col-8">
          <h1>{paperNameBeingShownInAdditionalInfo}</h1>
        </div>
        <div className="col-2">
          {paperNameBeingShownInTree != paperNameBeingShownInAdditionalInfo && (
            <button
              className="btn btn-primary"
              onClick={showOriginalPaperInfoOnClick}
            >
              Show info for {paperNameBeingShownInTree}
            </button>
          )}
        </div>
        <div className="col-2">
          {paperNameBeingShownInTree != paperNameBeingShownInAdditionalInfo && (
            <button
              className="btn btn-info"
              onClick={viewDisplayedPaperTreeOnClick}
            >
              Generate Tree for {paperNameBeingShownInAdditionalInfo}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreeControlsBar;
