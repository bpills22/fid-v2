import createClient from "openapi-fetch";
import type { paths } from "./aeroapi-openapi.4.22.0";

const client = createClient<paths>({
  baseUrl: "https://aeroapi.flightaware.com/aeroapi",
  headers: {
    "x-apikey": process.env.FLIGHTAWARE_API_KEY,
  },
});
export default client;
