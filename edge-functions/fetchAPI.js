export async function handleHttpRequest(request, context) {
  try {
    // Extract airportCode and flightType from the request path
    const pathSegments = request.path.split('/');
    const airportCode = pathSegments[3];  // 'kphl'
    const flightType = pathSegments[4];   // 'arrivals' or 'departures'

    // Construct the API URL for the FlightAware API
    const baseUrl = 'https://aeroapi.flightaware.com/aeroapi/airports';
    const apiUrl = `${baseUrl}/${airportCode}/flights/${flightType}`;

    // Log the constructed API URL for debugging
    console.log('Constructed API URL:', apiUrl);

    // Fetch the data from FlightAware API using the 'flightaware' origin
    const apiResponse = await fetch(apiUrl, {
      edgio: {
        origin: 'flightaware',
      },
      headers: {
        "x-apikey": "GMfzktw52I3XIoWlmyNaeiHtUze2DJTp",
      },
    });

    // Check if the response is valid
    if (!apiResponse || !apiResponse.ok) {
      const status = apiResponse ? apiResponse.status : "undefined";
      const statusText = apiResponse ? apiResponse.statusText : "No response received";
      console.log('Error with FlightAware API response:', status, statusText);

      // Log the error and send a detailed message
      return context.response.status(500).send(`Error with FlightAware API request: Status: ${status}, StatusText: ${statusText}`);
    }

    // Parse the response data
    const data = await apiResponse.json();

    // Log the response data
    console.log('FlightAware API Response Data:', data);

    // Return the response to the client
    return context.response.json(data);

  } catch (error) {
    // Log the error and return a 500 error
    console.error('Error in Edge Function:', error);
    return context.response.status(500).send(`Internal Server Error: ${error.message}`);
  }
}







