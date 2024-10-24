export async function handleHttpRequest(request, context) {
  try {
    const pathSegments = request.path.split('/');
    const airportCode = pathSegments[3];
    const flightType = pathSegments[4];

    // Construct the API URL for the FlightAware API
    const apiKey = "GMfzktw52I3XIoWlmyNaeiHtUze2DJTp";
    const baseUrl = 'https://aeroapi.flightaware.com/aeroapi/airports';
    const apiUrl = `${baseUrl}/${airportCode}/flights/${flightType}`;

    console.log('Constructed API URL:', apiUrl);

    // Fetch the data from FlightAware API
    const apiResponse = await fetch(apiUrl, {
      headers: {
        "x-apikey": apiKey,
      },
      edgio: {
        origin: 'flightaware',
      },
    });

    if (!apiResponse.ok) {
      console.log(`FlightAware API call failed with status: ${apiResponse.status}`);
      return context.response.status(apiResponse.status).send(`Error: ${apiResponse.statusText}`);
    }

    const data = await apiResponse.json();

    // Add the constructed API URL to the response for easier debugging in the frontend
    data.apiUrl = apiUrl;

    return context.response.json(data);
  } catch (error) {
    console.error('Error in Edge Function:', error);
    return context.response.status(500).send(`Internal Server Error: ${error.message}`);
  }
}





