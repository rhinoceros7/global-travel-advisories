import MapView from "../components/MapView.jsx";

function Home()
{
    return (
        <div className="relative">
            <div className="sr-only">
                <h1>Global Travel Advisories – Safety Info for 200+ Countries</h1>
                <p>
                    Stay informed with up-to-date travel advisories, entry restrictions, and safety ratings sourced from the US, UK, Canada, Australia, New Zealand, and Singapore.
                </p>
                <p>
                    Use the interactive map to explore personalized travel risk summaries, visa requirements, and border status for over 200 destinations.
                    Ideal for solo travelers, families, and digital nomads alike.
                </p>
            </div>
            <MapView />
        </div>
    );}

export default Home;