export default function BrandingFooter()
{
    return (
        <div
            className={`fixed bottom-2.5 left-32 z-[1000] bg-white dark:bg-gray-800 rounded-xl px-3 py-2 shadow flex items-center gap-2`}
        >
            <img
                src="/logo.png"
                alt="GlobalTravelAdvisories Logo"
                className="h-7"
            />
            <span className="text-lg font-semibold text-gray-800 dark:text-white">
        © {new Date().getFullYear()} GlobalTravelAdvisories.com
      </span>
        </div>
    );
}
