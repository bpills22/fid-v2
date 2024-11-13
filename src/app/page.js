"use client";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
// import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";

export default function HomePage() {
  const [currentPageUrl, setCurrentPageUrl] = useState(null);
  const [previousPages, setPreviousPages] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [flightData, setFlightData] = useState([]);
  const [flightType, setFlightType] = useState("arrivals");
  const [selectedAirport, setSelectedAirport] = useState("kaus");
  const [debugInfo, setDebugInfo] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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
    {
      destination: {
        city: "London Heathrow",
        code_iata: "LHR",
        timezone: "Europe/London",
      },
      origin: { city: "Austin", code_iata: "AUS", timezone: "America/Chicago" },
      operator_iata: "BA",
      ident_iata: "BA320",
      estimated_on: "2024-11-08T16:30:00Z",
      status: "Landed / Taxiing",
      aircraft_type: "A350",
    },
    {
      destination: {
        city: "Charlotte",
        code_iata: "CLT",
        timezone: "America/New York",
      },
      origin: {
        city: "Chicago",
        code_iata: "AUS",
        timezone: "America/Chicago",
      },
      operator_iata: "AA",
      ident_iata: "AA1462",
      estimated_on: "2024-11-08T16:30:00Z",
      status: "Landed / Taxiing",
      aircraft_type: "A350",
    },
  ];

  const fetchFlights = async (
    airportCode,
    type = "arrivals",
    pageUrl = null
  ) => {
    const url = pageUrl || `/api/flights/${airportCode}/${type}`;
    setDebugInfo(`URL passed to Edge Function: ${url}`);

    try {
      const response = await fetch(url, { method: "GET" });
      if (!response.ok)
        throw new Error(`API request failed with status ${response.status}`);

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
      setFlightData(mockFlightData);
      setDebugInfo("Using mock data due to API failure");
    }
  };

  const updateAirportLogo = (airportCode) => {
    setLogoUrl(
      `https://assets-flightaware.bpillsbury.com/fis-board/logos/${airportCode.toLowerCase()}.png`
    );
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

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...flightData].sort((a, b) => {
      const aValue = key === "city" ? a.origin.city : a[key];
      const bValue = key === "city" ? b.origin.city : b[key];

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFlightData(sortedData);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowDropUp fontSize="small" style={{ color: "white" }} />
    ) : (
      <ArrowDropDown fontSize="small" style={{ color: "white" }} />
    );
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        FlightAware Arrivals and Departures Information
      </Typography>

      <div className="logo-and-selector-container">
        {logoUrl && (
          <img
            id="airport-logo"
            src={logoUrl}
            alt="Airport Logo"
            style={{ maxWidth: "250px", maxHeight: "100px" }}
          />
        )}

        <div className="centered-selector">
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

          <div className="flight-type-links">
            <Typography
              variant="body1"
              onClick={() => handleFlightTypeChange("arrivals")}
              style={{
                cursor: "pointer",
                fontWeight: flightType === "arrivals" ? "bold" : "normal",
                color: flightType === "arrivals" ? "black" : "inherit",
                borderBottom:
                  flightType === "arrivals" ? "3px solid #FFC107" : "none",
              }}
            >
              Arrivals
            </Typography>
            <Typography
              variant="body1"
              onClick={() => handleFlightTypeChange("departures")}
              style={{
                cursor: "pointer",
                fontWeight: flightType === "departures" ? "bold" : "normal",
                color: flightType === "departures" ? "black" : "inherit",
                borderBottom:
                  flightType === "departures" ? "3px solid #FFC107" : "none",
                marginLeft: "10px",
              }}
            >
              Departures
            </Typography>
          </div>
        </div>
      </div>

      <Typography style={{ color: "red", marginTop: "10px" }}>
        {debugInfo}
      </Typography>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#003366" }}>
              <TableCell
                style={{ fontWeight: "bold", color: "white" }}
                onClick={() => handleSort("city")}
              >
                City {renderSortIcon("city")}
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "white" }}
                onClick={() => handleSort("code_iata")}
              >
                Airport Code {renderSortIcon("code_iata")}
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "white" }}
                onClick={() => handleSort("operator_iata")}
              >
                Airline {renderSortIcon("operator_iata")}
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "white" }}
                onClick={() => handleSort("ident_iata")}
              >
                Flight Number {renderSortIcon("ident_iata")}
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "white" }}
                onClick={() => handleSort("arrival_time")}
              >
                {flightType === "arrivals" ? "Arrival Time" : "Departure Time"}{" "}
                {renderSortIcon("arrival_time")}
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "white" }}
                onClick={() => handleSort("status")}
              >
                Status {renderSortIcon("status")}
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "white" }}
                onClick={() => handleSort("aircraft_type")}
              >
                Aircraft Type {renderSortIcon("aircraft_type")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flightData.length > 0 ? (
              flightData.map((flight, index) => (
                <TableRow
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#e0f7fa" : "#ffffff",
                  }}
                >
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
                  <TableCell>{flight.operator_iata || "GA"}</TableCell>
                  <TableCell>
                    {flight.ident_iata || "General Aviation"}
                  </TableCell>
                  <TableCell>
                    {new Date(
                      flight.actual_on ||
                        flight.estimated_on ||
                        flight.scheduled_on
                    ).toLocaleString("en-US") || "Unknown"}
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