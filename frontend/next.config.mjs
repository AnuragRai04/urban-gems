/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Explicitly pass this through to the client build
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  // Tell Vercel to ignore ESLint errors during deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Tell Vercel to ignore TypeScript errors during deployment
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
