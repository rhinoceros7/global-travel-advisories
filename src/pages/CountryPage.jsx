import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllSummaries } from "../api/advisoryService";
import { countryToISO } from "../data/countryCodeMap";
import ThemeToggle from "../components/ThemeToggle.jsx";
import CountrySearch from "../components/CountrySearch.jsx";
import BrandingFooter from "../components/Footer.jsx";
import { Helmet } from "react-helmet";

export default function CountryPage()
{
    const { countrySlug } = useParams();
    const [summary, setSummary] = useState(null);
    const [allSummaries, setAllSummaries] = useState([]);
    const [ countryName, setCountryName ] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getAllSummaries().then((all) => {
            setAllSummaries(all);
            const match = all.find((c) =>
                c.country.toLowerCase().replace(/\s+/g, "-") === countrySlug
            );
            if(match)
            {
                setSummary(match);
                setCountryName(match.country);
            }
            else
            {
                setCountryName(countrySlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()));
            }
        });
    }, [countrySlug]);

    // Loading summary animation.
    if(!countryName)
    {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
                    <div className="h-12 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="p-6 max-w-4xl mx-auto text-gray-900 dark:text-white">
            <Helmet>
                <title>{`Travel Advisory for ${countryName}`}</title>
                <meta
                    name="description"
                    content={
                        summary
                            ? `Stay informed about travel safety in ${countryName}. ${summary.risk_label} risk level. Visa: ${summary.entry_requirements.visa_required ? "Required" : "Not required"}. Borders open: ${summary.entry_requirements.borders_open ? "Yes" : "No"}.`
                            : `Get the latest travel information and safety advisories for ${countryName}.`
                    }
                />
                <meta property="og:title" content={`Travel Advisory for ${countryName}`} />
                <meta property="og:description" content="Explore safety info, travel warnings, and entry restrictions." />
                <meta property="og:url" content={`https://globaltraveladvisories.com/${countrySlug}`} />
                <script type="application/ld+json">
                    {`
                        {
                          "@context": "https://schema.org",
                          "@type": "TravelDestination",
                          "name": "${countryName}",
                          "url": "https://globaltraveladvisories.com/${countrySlug}",
                          "description": "Travel advisory for ${countryName}. Risk level: ${summary?.risk_label}. Visa required: ${summary?.entry_requirements?.visa_required ? "Yes" : "No"}.",
                          "image": "https://flagcdn.com/h120/${countryToISO[countryName.trim()]}.png"
                        }
                    `}
                </script>
            </Helmet>

            <ThemeToggle />
            <BrandingFooter />
            <button
                onClick={() => navigate('/')}
                className="mb-4 flex items-center gap-2 px-3 py-2 w-full max-w-xs sm:w-fit bg-blue-500 ..."
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Map
            </button>

            {/* Search bar */}
            <CountrySearch
                summaries={allSummaries}
                positionClass="static mt-4 mb-2 px-1 w-[95%] max-w-xs z-[999] sm:absolute sm:top-3 sm:left-12 sm:translate-x-0 sm:mt-0 sm:mb-0 sm:px-0"
            />

            {/* Country name + flag */}
            <div className="mb-2">
                <div className="flex items-center gap-3 mb-2">
                    {countryToISO[countryName?.trim()] &&
                        countryToISO[countryName.trim()].split(",").map((code) => (
                            <img
                                key={code.trim()}
                                src={`https://flagcdn.com/h40/${code.trim()}.png`}
                                alt={`${countryName} flag (${code.trim().toUpperCase()})`}
                                className="h-6 inline-block mr-2 rounded-sm"
                            />
                        ))}
                    <h1 className="text-3xl font-bold">{countryName}</h1>
                </div>
            </div>

                {summary ? (
                <>
                    {/* Risk badge */}
                    <span className={`inline-block text font-semibold px-3 py-1 rounded-full mb-4 ${
                        summary.overall_risk_level === 4
                            ? "bg-red-600 text-white"
                            : summary.overall_risk_level === 3
                                ? "bg-orange-500 text-white"
                                : summary.overall_risk_level === 2
                                    ? "bg-yellow-400 text-black"
                                    : summary.overall_risk_level === 1
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-400 text-black"
                    }`}>
      {summary.risk_label}
    </span>

                    {/* Last Updated */}
                    <p className="text-sm text-gray-500 italic mb-4">
                        Last updated: {new Date(summary.last_updated).toLocaleDateString()}
                    </p>

                    {/* Summary */}
                    <p className="mb-6 whitespace-pre-line">{summary.summary}</p>

                    {/* Reasons */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-6">
                        <h2 className="text-xl font-semibold mb-2">Key Risk Factors</h2>
                        <ul className="list-disc list-inside space-y-2">
                            {summary.reasons.map((r, i) => (
                                <li key={i}><strong>{r.type}:</strong> {r.description}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Advice */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-6">
                        <h2 className="text-xl font-semibold mb-2">If You Do Travel</h2>
                        <ul className="list-disc list-inside space-y-2">
                            {summary.advice_if_traveling.map((tip, i) => (
                                <li key={i}>{tip}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Entry Requirements */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-6">
                        <h2 className="text-xl font-semibold mb-2">Entry Requirements</h2>
                        <p className="mb-1">🛂 Visa Required: {summary.entry_requirements.visa_required ? "Yes" : "No"}</p>
                        <p className="mb-1">🌐 Borders Open: {summary.entry_requirements.borders_open ? "Yes" : "No"}</p>
                        <p className="space-y-2">{summary.entry_requirements.notes}</p>
                    </div>

                    {/* Traveler Warnings */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-6">
                        <h2 className="text-xl font-semibold mb-2">Traveler Warnings</h2>
                        <ul className="space-y-2">
                            {Object.entries(summary.traveler_warnings).map(([group, msg]) => (
                                <li key={group}>
                                    <span className="font-bold text-red-600 dark:text-red-400">{group.replace("_", " ").toUpperCase()}</span>: {msg}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Source Advisories */}
                    <h2 className="text-xl font-semibold mb-2">Other Governmental Sources</h2>
                    <ul className="list-disc list-inside space-y-1 text-blue-400">
                        {summary.source_advisories.map((src, i) => (
                            <li key={i}>
                                <a href={src.url} target="_blank" rel="noopener noreferrer">
                                    {src.source}: {src.risk_label}
                                </a>
                                <div className="text-sm text-gray-500 dark:text-gray-300">{src.notes}</div>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mt-4">
                    <p className="text-gray-600 dark:text-gray-300 italic">
                        No official travel advisory data is currently available for this country.
                    </p>
                </div>
            )}
        </div>
        </div>
    );
}

