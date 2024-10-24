let currentPageUrl = null; // Store the current page's URL for tracking
let previousPages = []; // Store previous pages to allow going back
let nextPageUrl = null; // Store next page URL from the API

// Function to fetch and populate flights for arrivals or departures
async function fetchFlights(airportCode, flightType = 'arrivals') {
    // Build the API URL for the Edge Function instead of directly to FlightAware API
    const url = `/api/flights/${airportCode}/${flightType}`;

    // Display the constructed API URL in the debug-info div for debugging purposes
    document.getElementById('debug-info').textContent = `Constructed API URL: ${url}`;

    try {
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        populateFlights(data, flightType);  // Pass flightType to differentiate between arrivals and departures

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

        // Enable "Previous Page" if there are previous pages stored
        if (previousPages.length > 0) {
            document.getElementById("prev-btn").disabled = false;
            document.getElementById("prev-btn-bottom").disabled = false;
        } else {
            document.getElementById("prev-btn").disabled = true;
            document.getElementById("prev-btn-bottom").disabled = true;
        }
    } catch (error) {
        console.error("Error fetching flight data:", error);
        document.getElementById('debug-info').textContent += `\nError: ${error.message}`;
    }
}


// Function to populate flights into the table (updated for both arrivals and departures)
function populateFlights(data, flightType) {
    const tbody = document.querySelector("#flights-table tbody");
    tbody.innerHTML = ''; // Clear the table

    // Fix the data access issue, accessing the 'arrivals' or 'departures' array
    const flights = flightType === 'departures' ? data.departures : data.arrivals;

    if (!flights || flights.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No flight data available</td></tr>'; // Adjust colspan to 6
        return;
    }

    flights.forEach(flight => {
        const city = flightType === 'departures' ? flight.destination.city : flight.origin.city;
        const airportCode = flightType === 'departures' ? flight.destination.code_iata : flight.origin.code_iata; // Airport code
        const flightCode = flight.ident_iata || "General Aviation";
        const status = flight.status;

        // Check if the flight type is "General_Aviation"
        const isGeneralAviation = flight.type === "General_Aviation";

        // Use 'GA' as the airline code if it's General Aviation or the airline code is not available
        const airlineCode = isGeneralAviation ? 'GA' : (flight.operator_iata || 'GA');

        // Dynamically create the URL for the airline logo based on the airline code
        const logoUrl = `https://edgio.nyc3.digitaloceanspaces.com/fis-board/logos/${airlineCode.toLowerCase()}.png`;

        // Create an image element for the logo
        const imgElement = new Image();
        imgElement.src = logoUrl;

        // Fallback to a generic logo if the specific airline logo is missing or if it's General Aviation
        imgElement.onerror = function () {
            this.src = "https://edgio.nyc3.digitaloceanspaces.com/fis-board/logos/ga.png";
        };

        // If it's General Aviation, set the flight code to "General Aviation"
        const displayFlightCode = isGeneralAviation ? "General Aviation" : flightCode;

        // Get the correct time field for arrivals or departures
        const timeField = flightType === 'departures' ? flight.estimated_out : flight.actual_on;
        const timezone = flightType === 'departures' ? flight.destination.timezone : flight.origin.timezone;
        const flightTime = new Date(timeField).toLocaleString("en-US", { timeZone: timezone });

        // Build the table row
        const row = `
            <tr>
                <td>${city || 'Unknown'}</td>
                <td>${airportCode || 'N/A'}</td>
                <td><img src="${imgElement.src}" alt="${airlineCode} Logo" class="airline-logo" onerror="this.src='https://edgio.nyc3.digitaloceanspaces.com/fis-board/logos/ga.png'"></td>
                <td>${displayFlightCode}</td>
                <td>${flightTime}</td>
                <td>${status || 'Unknown'}</td>
            </tr>`;

        // Append the row to the table body
        tbody.innerHTML += row;
    });
}

// New function to update the table headers
function updateTableHeaders(flightType) {
    const timeHeader = document.getElementById('time-header');
    if (flightType === 'departures') {
        timeHeader.textContent = 'Departure Time'; // Update to "Departure Time"
    } else {
        timeHeader.textContent = 'Arrival Time'; // Default to "Arrival Time"
    }
}

// Event listener for Submit button (for both arrivals and departures)
document.getElementById('submit-btn').addEventListener('click', () => {
    const airportCode = document.getElementById('airport-select').value;
    previousPages = []; // Reset previous pages when a new airport is selected
    currentPageUrl = null;

    // Default to 'arrivals' unless departures is active
    const flightType = document.getElementById('departures-btn').classList.contains('active') ? 'departures' : 'arrivals';
    updateTableHeaders(flightType); // Update the table headers dynamically
    fetchFlights(airportCode, flightType); // Fetch either arrivals or departures based on active button
});

// Clickable buttons for Arrivals and Departures
document.getElementById('arrivals-btn').addEventListener('click', () => {
    document.getElementById('arrivals-btn').classList.add('active');
    document.getElementById('arrivals-btn').classList.remove('inactive');

    document.getElementById('departures-btn').classList.remove('active');
    document.getElementById('departures-btn').classList.add('inactive');

    const airportCode = document.getElementById('airport-select').value;
    updateTableHeaders('arrivals'); // Update headers for Arrivals
    fetchFlights(airportCode, null, 'arrivals'); // Fetch arrivals data
});

document.getElementById('departures-btn').addEventListener('click', () => {
    document.getElementById('departures-btn').classList.add('active');
    document.getElementById('departures-btn').classList.remove('inactive');

    document.getElementById('arrivals-btn').classList.remove('active');
    document.getElementById('arrivals-btn').classList.add('inactive');

    const airportCode = document.getElementById('airport-select').value;
    updateTableHeaders('departures'); // Update headers for Departures
    fetchFlights(airportCode, null, 'departures'); // Fetch departures data
});

// Event listeners for pagination buttons remain the same
document.getElementById('next-btn').addEventListener('click', () => {
    if (nextPageUrl) {
        previousPages.push(currentPageUrl); // Store the current page
        currentPageUrl = nextPageUrl;
        const flightType = document.getElementById('departures-btn').classList.contains('active') ? 'departures' : 'arrivals';
        fetchFlights(null, flightType); // Fetch the next page (remove null argument)
    }
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (previousPages.length > 0) {
        currentPageUrl = previousPages.pop(); // Get the last page from history
        const flightType = document.getElementById('departures-btn').classList.contains('active') ? 'departures' : 'arrivals';
        fetchFlights(null, flightType); // Fetch the previous page (remove null argument)
    }
});

// Bottom pagination buttons functionality remains the same as above
document.getElementById('next-btn-bottom').addEventListener('click', () => {
    document.getElementById('next-btn').click();
});

document.getElementById('prev-btn-bottom').addEventListener('click', () => {
    document.getElementById('prev-btn').click();
});
