import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ApolloProvider } from "@apollo/client/react"; // ✅ Corrected: import from "@apollo/client"
import client from "./apollo/client.js";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css"; // Assuring Tailwind CSS is imported

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  </React.StrictMode>
);