import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

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