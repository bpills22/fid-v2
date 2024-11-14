// This file was automatically added by edgio init.
// You should commit this file to source control.
module.exports = {
  connector: "@edgio/next",

  name: "flight-aware-v2",
  organization: "se-apps",
  purgeCacheOnDeploy: true,

  origins: [
    {
      name: "flightaware", // FlightAware origin for API calls
      override_host_header: "aeroapi.flightaware.com",
      hosts: [
        {
          location: "aeroapi.flightaware.com",
        },
      ],
      tls_verify: {
        use_sni: true,
        sni_hint_and_strict_san_check: "aeroapi.flightaware.com",
      },
    },
    {
      name: "digitalocean", // DigitalOcean origin for assets
      override_host_header: "edgio.nyc3.digitaloceanspaces.com",
      hosts: [
        {
          location: "edgio.nyc3.digitaloceanspaces.com",
        },
      ],
      tls_verify: {
        use_sni: true,
        sni_hint_and_strict_san_check: "edgio.nyc3.digitaloceanspaces.com",
      },
    },
  ],

  environments: {
    nextjs: {
      hostnames: [
        {
          hostname: "next.flightaware.bpillsbury.com",
          default_origin_name: "edgio_serverless",
        },
      ],
    },
  },

  next: {
    generateSourceMaps: true, // Output sourcemaps for better error tracking
    // You can uncomment other options if you need to customize them
  },

  // Uncommented example of routes file path override (if needed)
  // routes: 'routes.js',
};
