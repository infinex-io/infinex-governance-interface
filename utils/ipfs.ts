export const parseURL = (url: string) =>
	url?.includes('ipfs') ? url.replace('ipfs://', 'https://ipfs.io/ipfs/') : url;
