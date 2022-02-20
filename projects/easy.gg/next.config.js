const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/edit',
        headers: [
          {
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
        headers: [
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          }
        ]
      }
    ]
  },
}

module.exports = nextConfig