/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.ibb.co', 'lh3.googleusercontent.com', 'res.cloudinary.com'],
    unoptimized: true, // Disable image optimization for static export
  },
}

module.exports = nextConfig
