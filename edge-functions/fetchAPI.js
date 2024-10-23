
export async function handleHttpRequest({ request, response }) {
  try {
    console.log('Request path:', request.path); // Log the incoming request path
    const apiKey = "GMfzktw52I3XIoWlmyNaeiHtUze2DJTp";
    const baseUrl = 'https://aeroapi.flightaware.com';

    // Build the FlightAware API URL based on the incoming request path
    const apiUrl = `${baseUrl}${request.path}`;
    console.log('Constructed API URL:', apiUrl); // Log the constructed API URL

    // Fetch data from FlightAware API
    const apiResponse = await fetch(apiUrl, {
      headers: {
        "x-apikey": apiKey,
      },
    });

    // If the API call fails, return an error response
    if (!apiResponse.ok) {
      console.error(`Error fetching data from FlightAware: ${apiResponse.statusText}`);
      return response.status(apiResponse.status).send(`Error fetching data: ${apiResponse.statusText}`);
    }

    const data = await apiResponse.json();

    // Set response headers
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Content-Type", "application/json");

    // Send the data back to the client
    response.body = data;
  } catch (err) {
    // Catch and log any errors
    console.error('Error in Edge Function:', err);
    response.status(500).send(`Error fetching flight data: ${err.message}`);
  }
}


