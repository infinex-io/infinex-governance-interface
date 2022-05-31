import React, { useEffect, useMemo, useState, useContext, createContext } from 'react';
import { ethers } from 'ethers';
import useLocalStorage from 'hooks/useLocalStorage';
import {
	BOARDROOM_SIGNIN_API_URL,
	BOARDROOM_SIGNOUT_API_URL,
	NONCE_API_URL,
} from 'constants/boardroom';
import { SiweMessage } from 'siwe';

import '@rainbow-me/rainbowkit/styles.css';
import {
	getDefaultWallets,
	RainbowKitProvider,
	connectorsForWallets,
	wallet,
} from '@rainbow-me/rainbowkit';
import {
	chain,
	configureChains,
	createClient,
	useAccount,
	useProvider,
	useSigner,
	WagmiConfig,
} from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

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

type SignOutResponse = {
	data: {
		success: boolean;
	};
};

type NonceResponse = {
	data: {
		nonce: string;
	};
};

type SignInResponse = {
	data: {
		ens: string;
		address: string;
		uuid: string;
	};
};

type ConnectorContextType = {
	ensName: string | null;
	ensAvatar: string | null;
	uuid: string | null;
	setUuid: (value: string | null) => void;
	boardroomSignIn: () => Promise<string | undefined>;
	boardroomSignOut: () => void;
	L1DefaultProvider: ethers.providers.InfuraProvider;
	L2DefaultProvider: ({
		chainId,
	}: {
		chainId?: number | undefined;
	}) => ethers.providers.StaticJsonRpcProvider | ethers.providers.FallbackProvider;
};

const ConnectorContext = createContext<unknown>(null);

export const useConnectorContext = () => {
	return useContext(ConnectorContext) as ConnectorContextType;
};

export const ConnectorContextProvider: React.FC = ({ children }) => {
	const L1DefaultProvider = useMemo(
		() => new ethers.providers.InfuraProvider(1, process.env.NEXT_INFURA_PROJECT_ID),
		[]
	);

	const [ensName, setEnsName] = useState<string | null>(null);
	const [ensAvatar, setEnsAvatar] = useState<string | null>(null);

	const { chains, provider } = useMemo(
		() =>
			configureChains(
				[chain.optimism],
				[infuraProvider({ infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID }), publicProvider()]
			),
		[]
	);

	const connectors = connectorsForWallets([
		{
			groupName: 'Recommended',
			wallets: [
				wallet.metaMask({ chains }),
				wallet.injected({ chains }),
				wallet.walletConnect({ chains }),
				wallet.ledger({ chains }),
			],
		},
	]);

	const wagmiClient = createClient({
		autoConnect: true,
		connectors,
		provider,
	});

	useEffect(() => {
		const address = wagmiClient.data?.account;
		if (address) {
			try {
				L1DefaultProvider.lookupAddress(address).then((ensName) => {
					if (ensName) {
						setEnsName(ensName);
						L1DefaultProvider.getAvatar(ensName).then((avatar) => {
							setEnsAvatar(avatar);
						});
					}
				});
			} catch (error) {
				console.log('No ENS found for address: ', address);
				console.error(error);
			}
		}
	}, [wagmiClient.data?.account, L1DefaultProvider]);

	// const boardroomSignIn = async () => {
	// 	// @TODO: change to real domain on prod
	// 	const domain = 'localhost:3000';

	// 	const chainId = 31337;

	// 	if (signer && provider && account) {
	// 		try {
	// 			const body = {
	// 				address: account,
	// 			};
	// 			let response = await fetch(NONCE_API_URL, {
	// 				method: 'POST',
	// 				body: JSON.stringify(body),
	// 			});
	// 			const nonceResponse: NonceResponse = await response.json();

	// 			let signedMessage = new SiweMessage({
	// 				domain: domain,
	// 				address: account,
	// 				chainId: chainId,
	// 				uri: `http://${domain}`,
	// 				version: '1',
	// 				statement: 'Sign into Boardroom with this wallet',
	// 				nonce: nonceResponse.data.nonce,
	// 				issuedAt: new Date().toISOString(),
	// 			});

	// 			const signature = await provider.getSigner().signMessage(signedMessage.prepareMessage());

	// 			const message = {
	// 				message: { ...signedMessage, signature },
	// 			} as SIWEMessage;

	// 			response = await fetch(BOARDROOM_SIGNIN_API_URL, {
	// 				method: 'POST',
	// 				body: JSON.stringify(message),
	// 			});

	// 			const signInResponse: SignInResponse = await response.json();

	// 			setUuid(signInResponse.data.uuid);

	// 			return signInResponse.data.uuid;
	// 		} catch (e) {
	// 			console.log(e);
	// 		}
	// 	}
	// };

	// const boardroomSignOut = async () => {
	// 	if (account && uuid) {
	// 		try {
	// 			const body = {
	// 				address: account,
	// 				uuid: uuid,
	// 			};
	// 			let response = await fetch(BOARDROOM_SIGNOUT_API_URL, {
	// 				method: 'POST',
	// 				body: JSON.stringify(body),
	// 			});

	// 			const { data }: SignOutResponse = await response.json();

	// 			if (data.success) {
	// 				setUuid(null);
	// 			}
	// 		} catch (e) {
	// 			console.log(e);
	// 		}
	// 	}
	// };

	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider chains={chains}>
				<ConnectorContext.Provider
					value={{
						// uuid,
						// setUuid,
						ensAvatar,
						ensName,
						provider,
						chains,
						// boardroomSignIn,
						// boardroomSignOut,
						L1DefaultProvider,
						L2DefaultProvider: provider,
					}}
				>
					{children}
				</ConnectorContext.Provider>
			</RainbowKitProvider>
		</WagmiConfig>
	);
};
