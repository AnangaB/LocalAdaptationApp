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
          Local Adaptation Search
        </Link>
        <Link
          className="nav-item nav-link text-light"
          to={`/graphs`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Graphs
        </Link>
      </div>
    </nav>
  );
};
export default GraphNavbar;
