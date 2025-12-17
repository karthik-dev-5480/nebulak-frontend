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
        protocol: "https",
        // Added the region 'ap-south-1' to match your actual URL
        hostname: "karthiknewproduct.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;