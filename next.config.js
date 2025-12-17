/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      { // First S3 bucket
        protocol: "https",
        hostname: "karthiknewproduct.s3.amazonaws.com",
        port: "",
        pathname: '/**',
      },
      { // Second S3 bucket
        protocol: "https",
        hostname: "karthiknosecurity.s3.amazonaws.com",
        port: "",
        pathname: '/**',
      },
      {
       source: "/**",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // Replace with your actual domain
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      },
    ],
  },
};

module.exports = nextConfig;