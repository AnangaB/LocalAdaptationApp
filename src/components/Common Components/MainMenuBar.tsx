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
          <div className="col-10 col-md-6">
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
            className="col-md-3 col-lg-2 collapse navbar-collapse"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className={isHomePageActive ? "nav-item active" : "nav-item"}>
                <Link
                  className="px-2 nav-link"
                  to="/LocalAdaptationApp"
                  style={{ textDecoration: "none" }}
                >
                  Home
                </Link>
              </li>
              <li
                className={!isHomePageActive ? "nav-item active" : "nav-item"}
              >
                <Link
                  className="px-2 nav-link"
                  to="/LocalAdaptationApp/graphs"
                  style={{ textDecoration: "none" }}
                >
                  Graphs
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default MainMenuBar;
