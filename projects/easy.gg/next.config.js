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
  }
}

module.exports = nextConfig