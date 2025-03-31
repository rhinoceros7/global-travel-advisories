import { useTheme } from "./ThemeContent.jsx";

export default function ThemeToggle()
{
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="fixed bottom-4 left-4 z-[1001] px-3 py-1 bg-gray-300 dark:bg-gray-800 text-black dark:text-white rounded shadow"
        >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
    );
}