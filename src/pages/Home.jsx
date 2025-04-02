import MapView from "../components/MapView.jsx";
import { Helmet } from "react-helmet";

function Home()
{
    return (
        <div className="relative">
            <Helmet>
                <title>Global Travel Advisories</title>
                <meta
                    name="description"
                    content="Explore the latest travel advisories, risk levels, and entry rules for 200+ countries using our interactive global map powered by trusted government sources."
                />
                <meta property="og:title" content="Global Travel Advisories" />
                <meta property="og:description" content="Stay informed with safety info, visa requirements, and travel warnings across the globe." />
                <meta property="og:url" content="https://globaltraveladvisories.com/" />
            </Helmet>

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