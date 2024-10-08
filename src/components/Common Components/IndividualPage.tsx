interface IndividualPageProps {
  row: Record<string, string>;
  showHeader?: boolean;
  backButtonOnClick?: (() => void) | null;
}

const IndividualPage: React.FC<IndividualPageProps> = ({
  row,
  showHeader = true,
  backButtonOnClick = null,
}) => {
  return (
    <div>
      {row && (
        <div className="container-fluid" key="IndividualPageContainerDiv">
          {showHeader && (
            <div className="row py-4">
              <div className="col-sm-9 col-md-10 col-12">
                <div className="h4">{row["Title"]}</div>
              </div>

              {backButtonOnClick != null && (
                <div className="col-sm-3 col-md-2 col-12">
                  <p className="btn btn-primary" onClick={backButtonOnClick}>
                    Go Back To Home
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="row">
            <div className="col-sm-12 col-md-9 border border-dark">
              <div className="row">
                {["Citation Key", "Authors", "Year", "Journal"].map((item) => (
                  <div
                    className="col-sm-6 col-md-4 col-lg-3"
                    key={`${item}-individual-page`}
                  >
                    <p>
                      <span className="h6">{item}:</span> {row[item]}
                    </p>
                  </div>
                ))}
              </div>
              <div className="col-12">
                <p className="h6">Abstract:</p>
                <p>{row["Abstract"]}</p>
              </div>
            </div>
            <div className="col-sm-6 col-md-3 pl-2">
              {[
                "Index",
                "Eco-Evo Focus",
                "Life history",
                "Ecological Loci/Traits",
                "Additional Loci/Traits",
                "Mating system",
                "Ploidy",
                "Selection",
                "Spatial Structure",
                "Population Size",
                "Ecological Model",
                "Recurrent Mutation",
                "IBS",
                "DOI",
                "ISSN",
                "url",
              ].map((item) => (
                <div className="row" key={`${item}-individual-page`}>
                  <p>
                    <span className="h6">{item}:</span> {row[item]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default IndividualPage;
