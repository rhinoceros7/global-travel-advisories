import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CountryPage from "./pages/CountryPage.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:countrySlug" element={<CountryPage />} />
        </Routes>
    );
}

export default App;