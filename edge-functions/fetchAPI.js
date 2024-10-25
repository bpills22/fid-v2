export async function handleHttpRequest(request, context) {
  try {
    // Extract airportCode and flightType from the request path
    const pathSegments = request.path.split('/');
    const airportCode = pathSegments[3]; // e.g., 'kaus'
    const flightType = pathSegments[4]; // e.g., 'arrivals' or 'departures'

    // Construct the API URL for the FlightAware API
    const apiKey = 'GMfzktw52I3XIoWlmyNaeiHtUze2DJTp';
    const baseUrl = 'https://aeroapi.flightaware.com/aeroapi/airports';
    const apiUrl = '${baseUrl}/${airportCode}/flights/${flightType}?max_pages=2';

    // Restore logging the constructed API URL
    console.log('Constructed API URL:', apiUrl);

    // Fetch the data from FlightAware API
    const apiResponse = await fetch(apiUrl, {
      edgio: {
        origin: 'flightaware',
      },
      headers: {
        'x-apikey': apiKey,
      },
    });

    // Remove logging the raw apiResponse since it's not helpful
    // console.log('apiResponse:', apiResponse);

    if (!apiResponse.ok) {
      // Log the response status and text if it's not OK
      console.log(
        'Error: API request failed with status:',
        apiResponse.status,
        'statusText:',
        apiResponse.statusText
      );
      return new Response(`Error: ${apiResponse.statusText}`, {
        status: apiResponse.status,
      });
    }

    // Parse the response data (but don't log it)
    const data = await apiResponse.json();

    // Return the response to the client
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Log the error in case of a failure
    console.error('Error in Edge Function:', error);
    return new Response(`Internal Server Error: ${error.message}`, {
      status: 500,
    });
  }
}
