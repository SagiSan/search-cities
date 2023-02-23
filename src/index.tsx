import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Navigate, RouterProvider, createHashRouter } from "react-router-dom";
import { SearchPage } from "./pages/SearchPage/SearchPage";
import { SearchResultsPage } from "./pages/SearchResultsPage/SearchResultsPage";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <SearchPage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/search-results", element: <SearchResultsPage /> },
      // { path: "*", element: <Navigate to="" /> },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
