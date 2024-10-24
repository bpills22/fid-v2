export async function handleHttpRequest(request, context) {
  try {
    // Extract airportCode and flightType from the request path
    const pathSegments = request.path.split('/');
    const airportCode = pathSegments[3];  // Example: 'kphl'
    const flightType = pathSegments[4];   // Example: 'arrivals' or 'departures'

    // Construct the API URL for the FlightAware API
    const apiUrl = `/aeroapi/airports/${airportCode}/flights/${flightType}`;

    // Log the constructed API URL for debugging
    console.log('Constructed API URL:', apiUrl);

    // Fetch the data from FlightAware API using the 'flightaware' origin
    const apiResponse = await fetch(apiUrl, {
      edgio: {
        origin: "flightaware",  // Make sure the request goes to the correct origin
      },
      headers: {
        "x-apikey": "GMfzktw52I3XIoWlmyNaeiHtUze2DJTp",  // API key for FlightAware
      },
    });

    if (!apiResponse.ok) {
      // If the response from FlightAware is not OK, return the error status
      return context.response.status(apiResponse.status).send(`Error: ${apiResponse.statusText}`);
    }

    // Parse the response data
    const data = await apiResponse.json();

    // Return the response to the client
    return context.response.json(data);
  } catch (error) {
    // Log the error and return a 500 error
    console.error('Error in Edge Function:', error);
    return context.response.status(500).send(`Internal Server Error: ${error.message}`);
  }
}



