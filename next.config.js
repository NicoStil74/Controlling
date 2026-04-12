/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        // Only apply localhost proxy in development. 
        // Vercel handles /api automatically in production.
        return process.env.NODE_ENV === 'development' 
            ? [
                {
                    source: "/api/:path*",
                    destination: "http://localhost:8000/:path*",
                },
              ]
            : [];
    },
};

module.exports = nextConfig;
