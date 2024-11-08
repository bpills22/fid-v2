"use client";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [currentPageUrl, setCurrentPageUrl] = useState(null);
  const [previousPages, setPreviousPages] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [flightData, setFlightData] = useState([]);
  const [flightType, setFlightType] = useState("arrivals");
  const [selectedAirport, setSelectedAirport] = useState("kaus");
  const [debugInfo, setDebugInfo] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  // Function to fetch and populate flights for arrivals or departures
  const fetchFlights = async (
    airportCode,
    type = "arrivals",
    pageUrl = null
  ) => {
    const url = pageUrl || `/api/flights/${airportCode}/${type}`;
    setDebugInfo(`URL passed to Edge Function: ${url}`);

    try {
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      setFlightData(type === "departures" ? data.departures : data.arrivals);

      if (data.links && data.links.next) {
        setNextPageUrl(
          `/api/flights/${airportCode}/${type}?cursor=${
            data.links.next.split("cursor=")[1]
          }`
        );
      } else {
        setNextPageUrl(null);
      }
    } catch (error) {
      console.error("Error fetching flight data:", error);
    }
  };

  // Function to update the airport logo
  const updateAirportLogo = (airportCode) => {
    const logoUrl = `https://assets-flightaware.bpillsbury.com/fis-board/logos/${airportCode.toLowerCase()}.png`;
    setLogoUrl(logoUrl);
  };

  useEffect(() => {
    // Initialize the page with the default airport
    updateAirportLogo(selectedAirport);
    fetchFlights(selectedAirport, "arrivals");
  }, []);

  const handleSelectChange = (event) => {
    const airportCode = event.target.value;
    setSelectedAirport(airportCode);
    setPreviousPages([]);
    setCurrentPageUrl(null);
    fetchFlights(airportCode, flightType);
    updateAirportLogo(airportCode);
  };

  const handleFlightTypeChange = (type) => {
    setFlightType(type);
    fetchFlights(selectedAirport, type);
  };

  const handleNextPage = () => {
    if (nextPageUrl) {
      setPreviousPages([...previousPages, currentPageUrl]);
      setCurrentPageUrl(nextPageUrl);
      fetchFlights(null, null, nextPageUrl);
    }
  };

  const handlePrevPage = () => {
    if (previousPages.length > 0) {
      const prevUrl = previousPages.pop();
      setCurrentPageUrl(prevUrl);
      setPreviousPages(previousPages);
      fetchFlights(null, null, prevUrl);
    }
  };

  return (
    <div>
      <h1>FlightAware Arrivals and Departures Information</h1>
      <div className="logo-and-selector-container">
        <div id="airport-logo-container">
          {logoUrl && (
            <img id="airport-logo" src={logoUrl} alt="Airport Logo" />
          )}
        </div>

        <div className="centered-selector">
          <label htmlFor="airport-select">Choose an airport:</label>
          <select
            id="airport-select"
            value={selectedAirport}
            onChange={handleSelectChange}
          >
            <option value="kaus">Austin - KAUS - AUS</option>
            <option value="kbos">Boston - KBOS - BOS</option>
            <option value="kbur">Burbank - KBUR - BUR</option>
            <option value="klax">Los Angeles Int'l - KLAX - LAX</option>
            <option value="ksna">Orange County/John Wayne - KSNA - SNA</option>
            <option value="engm">Oslo Norway - ENGM - OSL</option>
            <option value="kphl">Philadelphia - KPHL - PHL</option>
            <option value="kslc">Salt Lake City - KSLC - SLC</option>
            <option value="ksan">San Diego - KSAN - SAN</option>
            <option value="kilg">Wilmington Delaware - KILG - ILG</option>
          </select>

          <div className="button-container-inline">
            <button onClick={() => handleFlightTypeChange("arrivals")}>
              Arrivals
            </button>
            <button onClick={() => handleFlightTypeChange("departures")}>
              Departures
            </button>
          </div>
        </div>
      </div>

      <div
        id="debug-info"
        style={{ color: "red", fontSize: "14px", fontWeight: "bold" }}
      >
        {debugInfo}
      </div>

      <div className="pagination-container">
        <button onClick={handlePrevPage} disabled={previousPages.length === 0}>
          Previous Page
        </button>
        <button onClick={handleNextPage} disabled={!nextPageUrl}>
          Next Page
        </button>
      </div>

      <table id="flights-table">
        <thead>
          <tr>
            <th>City</th>
            <th>Airport Code</th>
            <th>Airline</th>
            <th>Flight Number</th>
            <th>Arrival Time</th>
            <th>Status</th>
            <th>Aircraft Type</th>
          </tr>
        </thead>
        <tbody>
          {flightData.length > 0 ? (
            flightData.map((flight, index) => (
              <tr key={index}>
                <td>
                  {flightType === "departures"
                    ? flight.destination?.city || "Unknown"
                    : flight.origin?.city || "Unknown"}
                </td>
                <td>
                  {flightType === "departures"
                    ? flight.destination?.code_iata || "N/A"
                    : flight.origin?.code_iata || "N/A"}
                </td>
                <td>
                  <img
                    src={`https://assets-flightaware.bpillsbury.com/fis-board/logos/${(
                      flight.operator_iata || "GA"
                    ).toLowerCase()}.png`}
                    alt={`${flight.operator_iata || "GA"} Logo`}
                    className="airline-logo"
                    onError={(e) =>
                      (e.target.src =
                        "https://edgio.nyc3.digitaloceanspaces.com/fis-board/logos/ga.png")
                    }
                  />
                </td>
                <td>{flight.ident_iata || "General Aviation"}</td>
                <td>
                  {new Date(
                    flight.actual_on ||
                      flight.estimated_on ||
                      flight.scheduled_on
                  ).toLocaleString("en-US", {
                    timeZone:
                      flightType === "arrivals"
                        ? flight.destination?.timezone
                        : flight.origin?.timezone,
                  }) || "Unknown"}
                </td>
                <td>{flight.status || "Unknown"}</td>
                <td>{flight.aircraft_type || "Unknown"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No flight data available</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination-container">
        <button onClick={handlePrevPage} disabled={previousPages.length === 0}>
          Previous Page
        </button>
        <button onClick={handleNextPage} disabled={!nextPageUrl}>
          Next Page
        </button>
      </div>
    </div>
  );
}
