/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['utfs.io'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'utfs.io',
          port: ''
        }
      ]
    },
    webpack: (config) => {
      config.externals = [...config.externals, 'socket.io-client'];
      return config;
    }
  }
  
  module.exports = nextConfig