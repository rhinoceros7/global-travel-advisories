import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import theme from "tailwindcss/defaultTheme.js";
import {ThemeProvider} from "./components/ThemeContent.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <ThemeProvider theme={theme}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </ThemeProvider>
);