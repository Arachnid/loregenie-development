/** @type {import('next').NextConfig} */
const nextConfig = {
  modularizeImports: {
    "@mui/material": {
      transform: "@mui/material/{{member}}",
    },
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },
  images: {
    domains: ["cdn.discordapp.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9199",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
