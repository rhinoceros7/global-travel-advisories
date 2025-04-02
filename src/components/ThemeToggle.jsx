import { useTheme } from "./ThemeContent.jsx";

export default function ThemeToggle()
{
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[1001] px-3 py-1 bg-gray-300 dark:bg-gray-800 text-black dark:text-white rounded shadow sm:left-3 sm:translate-x-0 sm:bottom-4"
        >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
    );
}