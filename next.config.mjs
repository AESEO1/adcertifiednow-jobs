/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Legacy /page-N URLs → canonical ?page=N (CDN-level, no function invocation)
      { source: "/page-1", destination: "/", permanent: true },
      { source: "/page-:number(\\d+)", destination: "/?page=:number", permanent: true },
      // /jobs has no page; send to /search
      { source: "/jobs", destination: "/search", permanent: true },
    ]
  },

  compress: true,

  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['jobs.adcertifiednow.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jobs.adcertifiednow.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: true,
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800',
          },
        ],
      },
    ]
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
