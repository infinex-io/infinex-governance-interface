export const parseURL = (url: string) =>
	url?.startsWith('ipfs://') ? url.replace('ipfs://', 'https://ipfs.io/ipfs/') : url;
