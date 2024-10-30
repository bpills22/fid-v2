let currentPageUrl = null; // Store the current page's URL for tracking
let previousPages = []; // Store previous pages to allow going back
let nextPageUrl = null; // Store next page URL from the API

// Function to fetch and populate flights for arrivals or departures
async function fetchFlights(airportCode, flightType = "arrivals") {
  const url = `/api/flights/${airportCode}/${flightType}`;

  // Ensure the debug-info div exists before writing to it
  const debugInfo = document.getElementById("debug-info");
  if (debugInfo) {
    debugInfo.innerHTML = `URL passed to Edge Function: ${url}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    populateFlights(data, flightType); // Pass flightType to differentiate between arrivals and departures

    // Handle pagination links for the 'Next' and 'Previous' buttons
    if (data.links && data.links.next) {
      nextPageUrl = data.links.next;
      document.getElementById("next-btn").disabled = false;
      document.getElementById("next-btn-bottom").disabled = false;
    } else {
      nextPageUrl = null;
      document.getElementById("next-btn").disabled = true;
      document.getElementById("next-btn-bottom").disabled = true;
    }

    if (previousPages.length > 0) {
      document.getElementById("prev-btn").disabled = false;
      document.getElementById("prev-btn-bottom").disabled = false;
    } else {
      document.getElementById("prev-btn").disabled = true;
      document.getElementById("prev-btn-bottom").disabled = true;
    }
  } catch (error) {
    console.error("Error fetching flight data:", error);
  }
}

// Function to populate flights into the table (updated for both arrivals and departures)
function populateFlights(data, flightType) {
  const tbody = document.querySelector("#flights-table tbody");
  tbody.innerHTML = ""; // Clear the table

  const flights = flightType === "departures" ? data.departures : data.arrivals;

  if (!flights || flights.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">No flight data available</td></tr>';
    return;
  }

  flights.forEach((flight) => {
    const city =
      flightType === "departures"
        ? flight.destination?.city || "Unknown"
        : flight.origin?.city || "Unknown";
    const airportCode =
      flightType === "departures"
        ? flight.destination?.code_iata || "N/A"
        : flight.origin?.code_iata || "N/A";
    const flightCode = flight.ident_iata || "General Aviation";
    const status = flight.status || "Unknown";

    const isGeneralAviation = flight.type === "General_Aviation";
    const airlineCode = isGeneralAviation ? "GA" : flight.operator_iata || "GA";
    const logoUrl = `https://assets-flightaware.bpillsbury.com/fis-board/logos/${airlineCode.toLowerCase()}.png`;

    const imgElement = new Image();
    imgElement.src = logoUrl;
    imgElement.onerror = function () {
      this.src =
        "https://edgio.nyc3.digitaloceanspaces.com/fis-board/logos/ga.png";
    };

    const displayFlightCode = isGeneralAviation
      ? "General Aviation"
      : flightCode;
    const timeField =
      flightType === "departures" ? flight.estimated_out : flight.actual_on;
    const timezone =
      flightType === "departures"
        ? flight.destination?.timezone
        : flight.origin?.timezone;
    const flightTime = timeField
      ? new Date(timeField).toLocaleString("en-US", { timeZone: timezone })
      : "Unknown";

    const row = `
            <tr>
                <td>${city}</td>
                <td>${airportCode}</td>
                <td><img src="${imgElement.src}" alt="${airlineCode} Logo" class="airline-logo"></td>
                <td>${displayFlightCode}</td>
                <td>${flightTime}</td>
                <td>${status}</td>
            </tr>`;

    tbody.innerHTML += row;
  });
}

// Function to update the table headers
function updateTableHeaders(flightType) {
  const timeHeader = document.getElementById("time-header");
  if (flightType === "departures") {
    timeHeader.textContent = "Departure Time";
  } else {
    timeHeader.textContent = "Arrival Time";
  }
}

// Event listener for Submit button
document.getElementById("submit-btn").addEventListener("click", () => {
  const airportCode = document.getElementById("airport-select").value;
  previousPages = [];
  currentPageUrl = null;

  const flightType = document
    .getElementById("departures-btn")
    .classList.contains("active")
    ? "departures"
    : "arrivals";
  updateTableHeaders(flightType);
  fetchFlights(airportCode, flightType);
});

// Event listener for Arrivals button
document.getElementById("arrivals-btn").addEventListener("click", () => {
  document.getElementById("arrivals-btn").classList.add("active");
  document.getElementById("departures-btn").classList.remove("active");

  const airportCode = document.getElementById("airport-select").value;
  updateTableHeaders("arrivals");
  fetchFlights(airportCode, "arrivals");
});

// Event listener for Departures button
document.getElementById("departures-btn").addEventListener("click", () => {
  document.getElementById("departures-btn").classList.add("active");
  document.getElementById("arrivals-btn").classList.remove("active");

  const airportCode = document.getElementById("airport-select").value;
  updateTableHeaders("departures");
  fetchFlights(airportCode, "departures");
});

// Pagination event listeners
document.getElementById("next-btn").addEventListener("click", () => {
  const airportCode = document.getElementById("airport-select").value;
  if (nextPageUrl) {
    previousPages.push(currentPageUrl);
    currentPageUrl = nextPageUrl;
    const flightType = document
      .getElementById("departures-btn")
      .classList.contains("active")
      ? "departures"
      : "arrivals";
    fetchFlights(airportCode, flightType);
  }
});

document.getElementById("prev-btn").addEventListener("click", () => {
  const airportCode = document.getElementById("airport-select").value;
  if (previousPages.length > 0) {
    currentPageUrl = previousPages.pop();
    const flightType = document
      .getElementById("departures-btn")
      .classList.contains("active")
      ? "departures"
      : "arrivals";
    fetchFlights(airportCode, flightType);
  }
});

document.getElementById("next-btn-bottom").addEventListener("click", () => {
  document.getElementById("next-btn").click();
});

document.getElementById("prev-btn-bottom").addEventListener("click", () => {
  document.getElementById("prev-btn").click();
});
