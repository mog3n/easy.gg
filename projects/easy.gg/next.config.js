const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{
        source: '/:path*',
        headers: [{
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
      {
        source: '/import',
        headers: [{
          key: 'Cross-Origin-Resource-Policy',
          value: 'cross-origin',
        }]
      }
    ]
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/proxy/clipThumbnail/:path*',
          destination: 'https://clips-media-assets2.twitch.tv/:path*'
        },
        {
          source: '/proxy/userProfilePic/:path*',
          destination: 'https://static-cdn.jtvnw.net/:path*'
        },
        {
          source: '/proxy/twitchClip/:path*',
          destination: 'https://production.assets.clips.twitchcdn.net/:path*',
        },
        {
          source: '/proxy/:path*',
          destination: 'https://:path*'
        }
      ]
    }
  },
  async redirects() {
    return [
      {
        source: '/tos',
        destination: 'https://ezgg.notion.site/EZ-GG-Terms-of-Service-b846e799c03146eca83baad98a7d0572',
        permanent: true
      },
      {
        source: '/privacy',
        destination: 'https://ezgg.notion.site/EZ-GG-Privacy-Policy-1ade4ba54a5c4262ae643e481c2c1a0d',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig