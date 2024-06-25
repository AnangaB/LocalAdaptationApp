import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root";
import Graphs from "./routes/Graphs";
import NotFound from "./routes/NotFound";

const router = createBrowserRouter([
  {
    path: "/LocalAdaptationApp",
    element: <Root />,
  },
  {
    path: "/LocalAdaptationApp/graphs",
    element: <Graphs />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
