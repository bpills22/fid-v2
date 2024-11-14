// This file was automatically added by edgio init.
// You should commit this file to source control.
import { Router } from "@edgio/core/router";
import { nextRoutes } from "@edgio/next";

export default new Router()
  // Add response compression for static assets
  .always({
    comment: "Compress static assets",
    response: {
      compress_content_types: [
        "text/html",
        "text/css",
        "text/xml",
        "text/plain",
        "text/javascript",
        "application/javascript",
        "application/x-javascript",
        "application/json",
        "application/xml",
        "image/svg+xml",
        "font/otf",
        "font/ttf",
        "font/woff",
        "font/woff2",
      ],
    },
  })

  // Add headers for debugging and True-Client-IP
  .always({
    headers: {
      debug_header: true,
      set_client_ip_custom_header: "True-Client-IP",
    },
    comment: "Enable Cache Debug Headers and True-Client-IP",
  })

  // Set CORS headers
  .always({
    headers: {
      set_response_headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
    },
  })

  // Route to handle API calls using the Edge Function
  .get("/api/flights/:airportCode/:flightType", {
    edge_function: "./edge-functions/fetchAPI.js", // Use the Edge Function for processing
    comment: "Proxy FlightAware API calls through Edgio",
    caching: {
      max_age: "0s", // Ensure we don't cache the API responses at the edge
      bypass_client_cache: true, // No browser caching for the API response
    },
    origin: {
      set_origin: "flightaware", // Ensure requests are sent to the FlightAware origin
    },
  })

  // Cache airline logos for 30 days
  .if(
    {
      edgeControlCriteria: {
        and: [
          { "=~": [{ request: "path" }, "^/fis-board/logos/(.*)"] },
          { "===": [{ "request.path": "extension" }, "png"] },
        ],
      },
    },
    {
      caching: { max_age: { 200: "30d" } },
      comment: "cache png files for 30 days for logos",
    }
  )

  // Include default Next.js routes
  .use(nextRoutes);
