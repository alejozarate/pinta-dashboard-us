/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	i18n: {
		locales: ['es'],
		defaultLocale: 'es',
	},
	images: {
		domains: ['localhost', 'solow.io', 'pinta-dashboard.solow.io'],
	},
}

module.exports = nextConfig
