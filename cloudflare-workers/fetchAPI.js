export default {
  async fetch(request, env, context) {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split("/");
      const airportCode = pathSegments[3];
      const flightType = pathSegments[4];
      const cursor = url.searchParams.get("cursor");

      const apiUrl = new URL(
        `https://aeroapi.flightaware.com/aeroapi/airports/${airportCode}/flights/${flightType}?max_pages=2`
      );
      if (cursor) {
        apiUrl.searchParams.append("cursor", cursor);
      }

      console.log("Constructed API URL:", apiUrl.toString());

      const apiResponse = await fetch(apiUrl.toString(), {
        headers: { "x-apikey": env.apikey },
      });

      if (!apiResponse.ok) {
        console.error("API request failed:", apiResponse.statusText);
        return new Response(`Error: ${apiResponse.statusText}`, {
          status: apiResponse.status,
        });
      }

      const data = await apiResponse.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error in Worker:", error);
      return new Response(`Internal Server Error: ${error.message}`, {
        status: 500,
      });
    }
  },
};
