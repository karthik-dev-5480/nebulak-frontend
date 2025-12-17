/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Remote Image Patterns
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "karthiknewproduct.s3.amazonaws.com",
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "karthiknosecurity.s3.amazonaws.com",
        pathname: '/**',
      },
    ],
  },

  // 2. Custom Headers (CORS/CORB logic)
  async headers() {
    return [
      {
        // This applies the headers to all routes
        source: "/:path*", 
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, 
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;