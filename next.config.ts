// next.config.js
module.exports = {
  experimental: { appDir: true },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/uploads/:path*",
      },
    ];
  },
};
