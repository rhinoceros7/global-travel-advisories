import {countryToISO} from "../data/countryCodeMap.js";

export default function PopupInfoBox({ hoveredCountry, selectedCountry, navigate })
{
    return (
        <div className="absolute top-3 right-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white
              p-2.5 shadow-xl rounded-xl max-w-xs w-[90%] z-[999] border border-gray-300 dark:border-gray-700 text-center">

            {/* Flag + Country */}
            <div className="flex justify-center items-center gap-2 mb-2">
                {countryToISO[hoveredCountry.country?.trim()] &&
                    countryToISO[hoveredCountry.country.trim()].split(",").map((code) => (
                        <img
                            key={code.trim()}
                            src={`https://flagcdn.com/h20/${code.trim()}.png`}
                            alt={`${hoveredCountry.country} flag (${code.trim().toUpperCase()})`}
                            className="h-5 w-auto rounded-sm mr-1"
                        />
                    ))}
                <h2 className="text-2xl font-semibold">
                    {hoveredCountry.country || selectedCountry || "Unknown Region"}
                </h2>
            </div>

            {/* Advisory Label */}
            {hoveredCountry.overall_risk_level && hoveredCountry.risk_label ? (
                <span
                    className={`inline-block text font-semibold px-3 py-1 rounded-full mb-1.5 ${
                        hoveredCountry.overall_risk_level === 4
                            ? "bg-red-600 text-white"
                            : hoveredCountry.overall_risk_level === 3
                                ? "bg-orange-500 text-white"
                                : hoveredCountry.overall_risk_level === 2
                                    ? "bg-yellow-400 text-black"
                                    : hoveredCountry.overall_risk_level === 1
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-400 text-black"
                    }`}
                >
                        {hoveredCountry.risk_label}
                    </span>
            ) : (
                <p className="text-sm italic text-gray-500 mb-1.5">
                    No advisory data available for this country.
                </p>
            )}

            {/* Button */}
            <div>
                <button
                    onClick={() =>
                        navigate(`/${(hoveredCountry.country || selectedCountry).toLowerCase().replace(/\s+/g, "-")}`)
                    }
                    className="mt-1 px-3 py-1 text bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    View Full Advisory
                </button>
            </div>
        </div>
    );
}

