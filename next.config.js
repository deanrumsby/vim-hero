/** @type {import('next').NextConfig} */
const allowSharedBufferHeaders = [
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
];

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'vim-wasm',
    'react-vim-wasm',
  ],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: allowSharedBufferHeaders,
      }
    ];
  },
}

module.exports = nextConfig
