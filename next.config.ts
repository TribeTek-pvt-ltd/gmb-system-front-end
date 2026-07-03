import type { NextConfig } from "next";
import dns from "node:dns";

// Fix Node.js IPv6 resolution timeout issues with Supabase fetch
dns.setDefaultResultOrder("ipv4first");

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['10.71.50.26'],
};

export default nextConfig;
