import { useQuery } from 'react-query';

export const NONCE_API_URL = 'https://xis287baki.execute-api.us-east-1.amazonaws.com/v1/siwe/nonce';

type NonceResponse = {
	data: {
		nonce: string;
	};
};

function useUserNonceQuery(walletAddress: string) {
	return useQuery<string>(
		['userNonce', walletAddress],
		async () => {
			const body = {
				address: walletAddress,
			};
			const response = await fetch(NONCE_API_URL, { method: 'POST', body: JSON.stringify(body) });
			const { data }: NonceResponse = await response.json();
			return data.nonce;
		},
		{
			enabled: walletAddress !== null && walletAddress.length > 0,
		}
	);
}

export default useUserNonceQuery;
