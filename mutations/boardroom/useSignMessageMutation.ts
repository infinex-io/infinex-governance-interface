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
const isMainnet = false;
const TEST_NET_URL = `https://xis287baki.execute-api.us-east-1.amazonaws.com`;
const MAIN_NET_URL = `https://api.boardroom.info`;
const domain = 'localhost:3000';
const chainId = 31337;
const BOARDROOM_SIGNIN_API_URL = `${isMainnet ? MAIN_NET_URL : TEST_NET_URL}/v1/siwe/signIn`;
const NONCE_API_URL = `${isMainnet ? MAIN_NET_URL : TEST_NET_URL}/v1/siwe/nonce`;

function useSignMessageMutation() {
	const { signer, walletAddress, provider } = Connector.useContainer();
	return useMutation('signMessageMutation', async () => {
		if (signer && provider && walletAddress) {
			try {
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
			} catch (error) {
				console.log(error);
			}
		} else {
			return new Error();
		}
	});
}

export default useSignMessageMutation;
