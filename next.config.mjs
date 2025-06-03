/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração limpa sem experimental
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

export default nextConfig