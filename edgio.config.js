//require('dotenv').config()

module.exports = {
  name: "flight-aware-v2",
  purgeCacheOnDeploy: true,

  origins: [
    {
      name: "nginx", // Nginx origin
      override_host_header: "164.92.178.144",
      hosts: [
        {
          location: "164.92.178.144",
        },
      ],
      tls_verify: {
        use_sni: true,
        sni_hint_and_strict_san_check: "flightaware.bpillsbury.com",
      },
    },
    {
      name: "flightaware", // FlightAware origin
      override_host_header: "aeroapi.flightaware.com", // Override the host header with the FlightAware API hostname
      hosts: [
        {
          location: "aeroapi.flightaware.com", // The location of the FlightAware API
        },
      ],
      tls_verify: {
        use_sni: true,
        sni_hint_and_strict_san_check: "aeroapi.flightaware.com",
      },
    },
    {
      name: "digitalocean", // DigitalOcean origin
      override_host_header: "edgio.nyc3.digitaloceanspaces.com", // Override the host header with DigitalOcean hostname
      hosts: [
        {
          location: "edgio.nyc3.digitaloceanspaces.com", // The location of DigitalOcean
        },
      ],
      tls_verify: {
        use_sni: true,
        sni_hint_and_strict_san_check: "edgio.nyc3.digitaloceanspaces.com", // SNI hint for DigitalOcean
      },
    },
  ],

  environments: {
    default: {
      hostnames: [
        { hostname: "flightaware.bpillsbury.com", default_origin_name: "nginx" }, // Points to Nginx origin
        { hostname: "assets-flightaware.bpillsbury.com", default_origin_name: "digitalocean" }, // Points to DigitalOcean origin
      ],
    },
  },
};




