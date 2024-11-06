export async function handleHttpRequest(request, context) {
  try {
    // Extract airportCode and flightType from the request path
    const pathSegments = request.path.split("/");
    const airportCode = pathSegments[3]; // e.g., 'kaus'
    const flightType = pathSegments[4]; // e.g., 'arrivals' or 'departures'

    // Retrieve cursor if available in the request query parameters
    const cursor = new URL(request.url).searchParams.get("cursor");

    // Construct the base API URL with max_pages
    const apiKey = context.environmentVars.apikey;
    let apiUrl = `https://aeroapi.flightaware.com/aeroapi/airports/${airportCode}/flights/${flightType}?max_pages=2`;

    // Append cursor as an additional parameter if it exists
    if (cursor) {
      apiUrl += `&cursor=${cursor}`;
    }

    // Ensure the constructed URL is logged correctly
    console.log("Constructed API URL:", apiUrl);

    // Fetch the data from FlightAware API
    const apiResponse = await fetch(apiUrl, {
      edgio: {
        origin: "flightaware",
      },
      headers: {
        "x-apikey": apiKey,
      },
    });

    if (!apiResponse.ok) {
      console.log(
        "Error: API request failed with status:",
        apiResponse.status,
        "statusText:",
        apiResponse.statusText
      );
      return new Response(`Error: ${apiResponse.statusText}`, {
        status: apiResponse.status,
      });
    }

    // Parse the response data
    const data = await apiResponse.json();

    // Return the response to the client
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in Edge Function:", error);
    return new Response(`Internal Server Error: ${error.message}`, {
      status: 500,
    });
  }
}
