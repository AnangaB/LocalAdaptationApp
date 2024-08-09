import { Link } from "react-router-dom";

const GraphNavbar: React.FC<{}> = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="navbar-nav">
        <Link
          className="navbar-brand px-1 text-light"
          to="/LocalAdaptationApp"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Database of Theoretical Models of Local Adaptation
        </Link>
        <Link
          className="nav-item nav-link text-light"
          to={`/LocalAdaptationApp/graphs`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Graphs
        </Link>
      </div>
    </nav>
  );
};
export default GraphNavbar;
