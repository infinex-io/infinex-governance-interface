/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['ipfs.io'],
	},
	async headers() {
		return [
			{
				source: '/manifest.json',
				headers: [
					{ key: 'Access-Control-Allow-Credentials', value: 'true' },
					{ key: 'Access-Control-Allow-Origin', value: 'https://app.safe.global' },
				],
			},
		];
	},
};

module.exports = nextConfig;
