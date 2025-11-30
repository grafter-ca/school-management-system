const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  // disable: process.env.NODE_ENV === "development",
   disable: false, // allowPWA in both dev and prod

});

module.exports = withPWA({
  experimental: {
    appDir: true, // enable App Router
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/uploads/:path*",
      },
    ];
  },
});
