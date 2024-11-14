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

  // Route to handle API calls using an Edge Function
  .get("/api/flights/:airportCode/:flightType", ({ cache, proxy }) => {
    cache({
      edge: {
        maxAgeSeconds: 0,
      },
      browser: {
        maxAgeSeconds: 0,
      },
    });
    proxy("api", {
      path: "/flights/:airportCode/:flightType",
      transformRequest: (req) => {
        req.setHeader("Authorization", "Bearer YOUR_API_KEY"); // Replace with your API key
      },
    });
  })

  // Cache airline logos for 30 days
  .match("/fis-board/logos/:file*", ({ cache }) => {
    cache({
      edge: {
        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
      },
      browser: {
        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
      },
    });
    // No need for a proxy here since it's static content served from your assets
  })

  // Include default Next.js routes
  .use(nextRoutes);
