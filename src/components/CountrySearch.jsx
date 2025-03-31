import {useState, useMemo, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";

export default function CountrySearch({ summaries })
{
    const [query, setQuery] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const listRef = useRef(null);
    const navigate = useNavigate();

    const countryList = useMemo(() => summaries.map(s => s.country), [summaries]);

    // Setup Fuse for fuzzy search
    const fuse = useMemo(() => new Fuse(countryList, {
        includeScore: true,
        threshold: 0.2,
    }), [countryList]);

    useEffect(() => {
        if(query.length > 1)
        {
            const results = fuse.search(query).slice(0,8).map(r =>r.item);
            setFiltered(results);
            setHighlightedIndex(0);
        }
        else
        {
            setFiltered([]);
            setHighlightedIndex(-1);
        }
    }, [query, fuse]);

    const goToCountry = (countryName) => {
        const slug = countryName.toLowerCase().replace(/\s+/g, "-");
        navigate(`/${slug}`);
        setQuery("");
        setFiltered([]);
        setHighlightedIndex(-1);
    };

    // Handle using arrow keys to navigate through search results.
    const handleKeyDown = (e) => {
        if(e.key === "ArrowDown")
        {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev + 1) % filtered.length);
        }
        else if(e.key === "ArrowUp")
        {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
        }
        else if(e.key === "Enter")
        {
            e.preventDefault();
            if(filtered[highlightedIndex])
            {
                goToCountry(filtered[highlightedIndex]);
            }
        }
    };

    useEffect(() => {
        // Auto-scroll to keep highlighted item in view
        if(listRef.current && highlightedIndex >= 0)
        {
            const item = listRef.current.children[highlightedIndex];
            if(item)
            {
                item.scrollIntoView({ block: "nearest" });
            }
        }
    }, [highlightedIndex]);

    return (
        <div className="absolute top-3 left-12 z-[999] w-[90%] max-w-xs">
            <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                            p-2.5 shadow-xl rounded-xl border border-gray-300 dark:border-gray-700 text-center">
                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        placeholder="Search country..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </form>

                {filtered.map((name, idx) => (
                    <li
                        key={idx}
                        onClick={() => goToCountry(name)}
                        className={`mt-2 px-3 py-2 rounded-md cursor-pointer ${
                            idx === highlightedIndex
                                ? "bg-blue-100 dark:bg-gray-700"
                                : "hover:bg-blue-50 dark:hover:bg-gray-700"
                        }`}
                    >
                        {name}
                    </li>
                ))}
            </div>
        </div>
    );
}
