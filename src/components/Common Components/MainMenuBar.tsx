//import AdvancedSearchBar from "./AdvancedSearchBar.tsx";
//import SimpleSearchBar from "./SimpleSearchBar.tsx";
import "bootstrap-icons/font/bootstrap-icons.css";

import { Link } from "react-router-dom";
interface MainMenuBarProps {
  isHomePageActive: boolean;
}

const MainMenuBar: React.FC<MainMenuBarProps> = ({ isHomePageActive }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand px-1" to="/LocalAdaptationApp">
          Database of Theoretical Models of Local Adaptation
        </Link>
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
        <div
          className="collapse navbar-collapse justify-content-left"
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
    </nav>
  );
};
export default MainMenuBar;
