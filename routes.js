// This file was added by edgio init.
// You should commit this file to source control.
import { Router, edgioRoutes } from '@edgio/core'

export default new Router()
  // Here is an example where we cache api/* at the edge but prevent caching in the browser
  // .match('/api/:path*', {
  //   caching: {
  //     max_age: '1d',
  //     stale_while_revalidate: '1h',
  //     bypass_client_cache: true,
  //     service_worker_max_age: '1d',
  //   },
  // })

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

  .always({
    headers: {
      debug_header: true,
      set_client_ip_custom_header: "True-Client-IP",
    },
    comment: "Enable Cache Debug Headers and True-Client-IP",
  })
  .always({
    headers: {
      set_response_headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
    },
  })

  // Route to handle the API calls using your Edge Function
  .get('/api/flights/:airportCode/:flightType', {
    edge_function: './edge-functions/fetchAPI.js',
    comment: 'Proxy FlightAware API calls through Edgio',
    caching: {
      max_age: '0s', // Ensure we don't cache the API responses at the edge
      bypass_client_cache: true, // No browser caching for the API response
    },
  })

  // plugin enabling basic Edgio functionality
  .use(edgioRoutes);
