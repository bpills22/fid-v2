export async function handleHttpRequest(request, context) {
  try {
    // Log the incoming request path for debugging
    console.log('Request path:', request.path);

    // Split the request path to extract the airportCode and flightType
    const pathSegments = request.path.split('/');
    const airportCode = pathSegments[3];
    const flightType = pathSegments[4];

    // Log the extracted values for debugging
    console.log('Airport Code:', airportCode);
    console.log('Flight Type:', flightType);

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
    });

    // Check if the API response was successful
    if (!apiResponse.ok) {
      return context.response.status(apiResponse.status).send(`Error: ${apiResponse.statusText}`);
    }

    const data = await apiResponse.json();

    // Set CORS headers and send the data as a response
    context.response.setHeader("Access-Control-Allow-Origin", "*");
    context.response.setHeader("Content-Type", "application/json");
    context.response.body = JSON.stringify(data);  // Send the data back to the client

  } catch (err) {
    // Handle any errors and return a 500 response
    context.response.status(500).send(`Edge function error: ${err.message}`);
  }
}





