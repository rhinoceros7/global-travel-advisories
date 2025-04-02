export default function BrandingFooter()
{
    return (
        <div className="fixed bottom-2.5 left-1/2 -translate-x-1/2 z-[1000] max-w-[95%] px-3 py-2 w-fit flex items-center gap-2
        bg-white dark:bg-gray-800 rounded-xl shadow sm:left-32 sm:translate-x-0">
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
