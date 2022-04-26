import Connector from 'containers/Connector';
import { ethers } from 'ethers';
// import useUserNonceQuery from 'queries/boardroom/useUserNonceQuery';
import { useMutation } from 'react-query';

type SIWEMessage = {
	message: {
		domain: string;
		address: string;
		chainId: string;
		uri: string;
		version: string;
		statement: string;
		type: string;
		nonce: string;
		issuedAt: string;
		signature?: string;
	};
};

type NonceResponse = {
	data: {
		nonce: string;
	};
};

// @TODO: change to real domain on prod
const domain = 'localhost:4361';
const chainId = '1';
const BOARDROOM_SIGNIN_API_URL =
	'https://xis287baki.execute-api.us-east-1.amazonaws.com/v1/siwe/signIn';
const NONCE_API_URL = 'https://xis287baki.execute-api.us-east-1.amazonaws.com/v1/siwe/nonce';

function useSignMessageMutation() {
	const { signer, walletAddress } = Connector.useContainer();
	return useMutation('signMessageMutation', async () => {
		if (signer) {
			const body = {
				address: walletAddress,
			};
			let response = await fetch(NONCE_API_URL, {
				method: 'POST',
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const { data }: NonceResponse = await response.json();

			const message = {
				message: {
					domain: domain,
					address: walletAddress,
					chainId: chainId,
					uri: `http://${domain}`,
					version: '1',
					statement: 'Sign into Boardroom with this wallet',
					type: 'Personal signature',
					nonce: data.nonce,
					issuedAt: new Date().toISOString(),
				},
			} as SIWEMessage;

			const signature = await signer.signMessage(JSON.stringify(message));

			message.message.signature = signature;

			response = await fetch(BOARDROOM_SIGNIN_API_URL, {
				method: 'POST',
				body: JSON.stringify(message),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			console.log(response);

			return response;
		} else {
			return new Error();
		}
	});
}

export default useSignMessageMutation;
