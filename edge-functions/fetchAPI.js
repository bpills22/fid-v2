export async function handleHttpRequest(request, context) {
  try {
    // Extract airportCode and flightType from the request path
    const pathSegments = request.path.split('/');
    const airportCode = pathSegments[3];  // e.g., 'kaus'
    const flightType = pathSegments[4];   // e.g., 'arrivals' or 'departures'

    // Construct the API URL for the FlightAware API
    const apiKey = "GMfzktw52I3XIoWlmyNaeiHtUze2DJTp";
    const baseUrl = 'https://aeroapi.flightaware.com/aeroapi/airports';
    const apiUrl = `${baseUrl}/${airportCode}/flights/${flightType}`;

    // Commenting out the console.log of the API URL since it's confirmed to be correct
    // console.log('Constructed API URL:', apiUrl);

    // Fetch the data from FlightAware API
    const apiResponse = await fetch(apiUrl, {
      edgio: {
        origin: 'flightaware',
      },
      headers: {
        "x-apikey": apiKey,
      },
    });

    // Log the raw apiResponse to troubleshoot
    console.log('apiResponse:', apiResponse);

    if (!apiResponse.ok) {
      // Log the response status and text if it's not OK
      console.log('Error: API request failed with status:', apiResponse.status, 'statusText:', apiResponse.statusText);
      return context.response.status(apiResponse.status).send(`Error: ${apiResponse.statusText}`);
    }

    // Parse the response data (but don't log it)
    const data = await apiResponse.json();

    // Return the response to the client
    return context.response.json(data);

  } catch (error) {
    // Log the error in case of a failure
    console.error('Error in Edge Function:', error);
    return context.response.status(500).send(`Internal Server Error: ${error.message}`);
  }
}









