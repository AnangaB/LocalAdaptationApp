import "bootstrap/dist/css/bootstrap.min.css";
import GraphNavbar from "../components/GraphsComponents/GraphNavbar";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <>
      <GraphNavbar />
      <div className="container-fluid pt-5 mt-5 text-center">
        <h1 className="display-4">404 - Not Found</h1>
        <p className="lead">The page you are looking for does not exist.</p>
        <p className="lead">
          Click <Link to="/LocalAdaptationApp">here</Link> to go back to the
          homepage or use the navigation bar above.
        </p>
      </div>
    </>
  );
}

export default NotFound;
