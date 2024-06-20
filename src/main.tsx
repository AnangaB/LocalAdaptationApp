import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root";
import Graphs from "./routes/Graphs";

const router = createBrowserRouter([
  {
    path: "/LocalAdaptationApp",
    element: <Root />,
  },
  {
    path: "/graphs",
    element: <Graphs />,
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
