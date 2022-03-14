/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BACK_IP: "localhost:8000",
  },
};

module.exports = nextConfig;
