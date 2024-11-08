"use client";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function HomePage() {
  const [currentPageUrl, setCurrentPageUrl] = useState(null);
  const [previousPages, setPreviousPages] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [flightData, setFlightData] = useState([]);
  const [flightType, setFlightType] = useState("arrivals");
  const [selectedAirport, setSelectedAirport] = useState("kaus");
  const [debugInfo, setDebugInfo] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  // Mock data for local testing
  const mockFlightData = [
    {
      destination: {
        city: "Orlando",
        code_iata: "SFB",
        timezone: "America/New_York",
      },
      origin: { city: "Austin", code_iata: "AUS", timezone: "America/Chicago" },
      operator_iata: "GA",
      ident_iata: "General Aviation",
      actual_on: "2024-11-08T15:00:00Z",
      status: "Arrived",
      aircraft_type: "C56X",
      type: "General_Aviation",
    },
    {
      destination: {
        city: "Phoenix",
        code_iata: "PHX",
        timezone: "America/Phoenix",
      },
      origin: { city: "Austin", code_iata: "AUS", timezone: "America/Chicago" },
      operator_iata: "WN",
      ident_iata: "WN1179",
      estimated_on: "2024-11-08T15:30:00Z",
      status: "Landed / Taxiing",
      aircraft_type: "B38M",
    },
  ];

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
      // Use mock data for testing
      setFlightData(mockFlightData);
      setDebugInfo("Using mock data due to API failure");
    }
  };

  const updateAirportLogo = (airportCode) => {
    const logoUrl = `https://assets-flightaware.bpillsbury.com/fis-board/logos/${airportCode.toLowerCase()}.png`;
    setLogoUrl(logoUrl);
  };

  useEffect(() => {
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
    <Container>
      <Typography variant="h3" gutterBottom>
        FlightAware Arrivals and Departures Information
      </Typography>

      {logoUrl && (
        <img
          id="airport-logo"
          src={logoUrl}
          alt="Airport Logo"
          style={{ maxWidth: "250px", maxHeight: "100px", display: "block" }}
        />
      )}

      <div style={{ marginTop: "20px" }}>
        <Typography variant="body1">Choose an airport:</Typography>
        <Select
          value={selectedAirport}
          onChange={handleSelectChange}
          displayEmpty
        >
          <MenuItem value="kaus">Austin - KAUS - AUS</MenuItem>
          <MenuItem value="kbos">Boston - KBOS - BOS</MenuItem>
          <MenuItem value="kbur">Burbank - KBUR - BUR</MenuItem>
          <MenuItem value="klax">Los Angeles Int'l - KLAX - LAX</MenuItem>
          <MenuItem value="ksna">
            Orange County/John Wayne - KSNA - SNA
          </MenuItem>
          <MenuItem value="engm">Oslo Norway - ENGM - OSL</MenuItem>
          <MenuItem value="kphl">Philadelphia - KPHL - PHL</MenuItem>
          <MenuItem value="kslc">Salt Lake City - KSLC - SLC</MenuItem>
          <MenuItem value="ksan">San Diego - KSAN - SAN</MenuItem>
          <MenuItem value="kilg">Wilmington Delaware - KILG - ILG</MenuItem>
        </Select>
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <Button
          variant="contained"
          onClick={() => handleFlightTypeChange("arrivals")}
        >
          Arrivals
        </Button>
        <Button
          variant="contained"
          onClick={() => handleFlightTypeChange("departures")}
        >
          Departures
        </Button>
      </div>

      <div
        style={{
          color: "red",
          fontSize: "14px",
          fontWeight: "bold",
          marginTop: "10px",
        }}
      >
        {debugInfo}
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <Button
          variant="contained"
          onClick={handlePrevPage}
          disabled={previousPages.length === 0}
        >
          Previous Page
        </Button>
        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={!nextPageUrl}
        >
          Next Page
        </Button>
      </div>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>City</TableCell>
              <TableCell>Airport Code</TableCell>
              <TableCell>Airline</TableCell>
              <TableCell>Flight Number</TableCell>
              <TableCell>Arrival Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Aircraft Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flightData.length > 0 ? (
              flightData.map((flight, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {flightType === "departures"
                      ? flight.destination?.city || "Unknown"
                      : flight.origin?.city || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {flightType === "departures"
                      ? flight.destination?.code_iata || "N/A"
                      : flight.origin?.code_iata || "N/A"}
                  </TableCell>
                  <TableCell>
                    <img
                      src={`https://assets-flightaware.bpillsbury.com/fis-board/logos/${(
                        flight.operator_iata || "GA"
                      ).toLowerCase()}.png`}
                      alt={`${flight.operator_iata || "GA"} Logo`}
                      style={{ width: "100px", objectFit: "contain" }}
                      onError={(e) =>
                        (e.target.src =
                          "https://edgio.nyc3.digitaloceanspaces.com/fis-board/logos/ga.png")
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {flight.ident_iata || "General Aviation"}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>{flight.status || "Unknown"}</TableCell>
                  <TableCell>{flight.aircraft_type || "Unknown"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>No flight data available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
