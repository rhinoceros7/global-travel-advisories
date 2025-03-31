import axios from "axios";

const API_BASE = "https://travel-advisory-map-api.onrender.com/";

export async function getAllSummaries()
{
    const res = await axios.get(`${API_BASE}/summaries`);
    return res.data;
}

export async function getSummaryByCountry(countryName)
{
    const res = await axios.get(`${API_BASE}/summaries/${countryName}`);
    return res.data;
}