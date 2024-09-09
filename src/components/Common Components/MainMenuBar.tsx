//import AdvancedSearchBar from "./AdvancedSearchBar.tsx";
//import SimpleSearchBar from "./SimpleSearchBar.tsx";
import "bootstrap-icons/font/bootstrap-icons.css";

import { Link } from "react-router-dom";
interface MainMenuBarProps {
  isHomePageActive: boolean;
}

const MainMenuBar: React.FC<MainMenuBarProps> = ({ isHomePageActive }) => {
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container-fluid">
        <div className="row p-1 w-100">
          <div className="col-10">
            <Link
              className="navbar-brand px-1 text-wrap"
              to="/LocalAdaptationApp"
            >
              Database of Theoretical Models of Local Adaptation
            </Link>
          </div>
          <div className="col-2 d-lg-none">
            <div className="d-flex w-100 justify-content-end">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
          </div>

          <div
            className="col-lg-2 collapse navbar-collapse justify-content-left"
            id="navbarNav"
          >
            <Link
              className={
                isHomePageActive
                  ? "text-light px-2 nav-item nav-link active"
                  : "text-light px-2 nav-item nav-link"
              }
              to="/LocalAdaptationApp"
              style={{ textDecoration: "none" }}
            >
              Home
            </Link>
            <Link
              to={`/LocalAdaptationApp/graphs`}
              className={
                !isHomePageActive
                  ? "text-light px-2 nav-item nav-link active"
                  : "text-light px-2 nav-item nav-link"
              }
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Graphs
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default MainMenuBar;
