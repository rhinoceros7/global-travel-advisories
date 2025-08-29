# Global Travel Advisories

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC_BY--NC_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)


Interactive web app that maps government travel advisories for more than 200 countries. Browse a world map, search for a destination, and read detailed safety information, entry requirements, and traveller warnings for each location.

## Features
- **Interactive map** showing the latest risk levels and summaries for every country.
- **Country pages** with risk badges, key risk factors, entry requirements, and traveller warnings.
- **Search** to quickly jump to a country and explore nearby destinations.
- Fetches live data from a hosted API at `https://travel-advisory-map-api.onrender.com`.

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:5173.
3. **Run linting**
   ```bash
   npm run lint
   ```
4. **Build for production**
   ```bash
   npm run build
   ```
5. **Preview the production build**
   ```bash
   npm run preview
   ```

- [React](https://react.dev/) + [Vite](https://vite.dev/) for the frontend.
- [Leaflet](https://leafletjs.com/) and vector tiles for map rendering.
- Tailwind CSS for styling.
## API
The frontend calls a companion API to retrieve travel summaries:
```js
const API_BASE = "https://travel-advisory-map-api.onrender.com";
```
Endpoints used:
- `GET /summaries` – list all country summaries.
- `GET /summaries/:country` – retrieve the summary for a specific country.

## License
This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License](LICENSE).
