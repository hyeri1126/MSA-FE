/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@fullcalendar'],
    reactStrictMode: false,
    images: {
      domains: ['dapi.kakao.com', 'k.kakaocdn.net']
    },
    async headers() {
      return [
          {
              source: '/:path*',
              headers: [
                  {
                      key: 'Content-Security-Policy',
                      value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' dapi.kakao.com k.kakaocdn.net;"
                  }
              ]
          }
      ]
    }
  }
  
  export default nextConfig;