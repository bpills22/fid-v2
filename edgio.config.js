module.exports = {
  name: "flight-aware-v2",
  purgeCacheOnDeploy: true,

  origins: [
    {
      name: "origin", // Nginx origin
      override_host_header: "164.92.178.144",
      hosts: [
        {
          location: "164.92.178.144",
        },
      ],
      tls_verify: {
        use_sni: true,
        sni_hint_and_strict_san_check: "flights.bpillsbury.com",
      },
    },
    {
      name: "flightaware", // New FlightAware origin
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
  ],
};

