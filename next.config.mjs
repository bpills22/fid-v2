// This file was automatically added by edgio init.
// You should commit this file to source control.
// This file was automatically added by edgio init.
// You should commit this file to source control.
import { withEdgio } from "@edgio/next/config/index.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["assets-flightaware.bpillsbury.com"], // Add your external domain here
  },
};

const _preEdgioExport = nextConfig;

export default (_phase, _config) =>
  withEdgio({
    ..._preEdgioExport,
  });
