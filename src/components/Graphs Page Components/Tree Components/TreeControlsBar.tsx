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
        <div className="col-12 col-lg-6">
          <h1>{paperNameBeingShownInAdditionalInfo}</h1>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          {paperNameBeingShownInTree != paperNameBeingShownInAdditionalInfo && (
            <button
              className="btn btn-primary w-100 h-100"
              onClick={showOriginalPaperInfoOnClick}
            >
              Show info below for {paperNameBeingShownInTree}
            </button>
          )}
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          {paperNameBeingShownInTree != paperNameBeingShownInAdditionalInfo && (
            <button
              className="btn btn-info w-100 h-100"
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
