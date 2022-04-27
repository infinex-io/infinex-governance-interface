import { BOARDROOM_SIGNIN_API_URL, NONCE_API_URL } from 'constants/boardroom';
import Connector from 'containers/Connector';
import { useMutation } from 'react-query';
import { SiweMessage } from 'siwe';

type SIWEMessage = {
	message: {
		domain: string;
		address: string;
		chainId: number;
		uri: string;
		version: string;
		statement: string;
		nonce: string;
		issuedAt: string;
		signature: string;
	};
};

type NonceResponse = {
	data: {
		nonce: string;
	};
};

type UUIDResponse = {
	data: {
		ens: string;
		address: string;
		uuid: string;
	};
};

// @TODO: change to real domain on prod
const domain = 'localhost:3000';
const chainId = 31337;

function useSignInMutation() {
	const { signer, walletAddress, provider } = Connector.useContainer();
	return useMutation('signMessageMutation', async () => {
		if (signer && provider && walletAddress) {
			const body = {
				address: walletAddress,
			};
			let response = await fetch(NONCE_API_URL, {
				method: 'POST',
				body: JSON.stringify(body),
			});
			const nonceResponse: NonceResponse = await response.json();

			let signedMessage = new SiweMessage({
				domain: domain,
				address: walletAddress,
				chainId: chainId,
				uri: `http://${domain}`,
				version: '1',
				statement: 'Sign into Boardroom with this wallet',
				nonce: nonceResponse.data.nonce,
				issuedAt: new Date().toISOString(),
			});

			const signature = await provider.getSigner().signMessage(signedMessage.prepareMessage());

			const message = {
				message: { ...signedMessage, signature },
			} as SIWEMessage;

			response = await fetch(BOARDROOM_SIGNIN_API_URL, {
				method: 'POST',
				body: JSON.stringify(message),
			});

			const uuidResponse: UUIDResponse = await response.json();

			return uuidResponse.data;
		} else {
			return new Error();
		}
	});
}

export default useSignInMutation;
