import React, { useEffect, useMemo, useState, useContext, createContext } from 'react';
import { useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import useLocalStorage from 'hooks/useLocalStorage';
import {
	BOARDROOM_SIGNIN_API_URL,
	BOARDROOM_SIGNOUT_API_URL,
	NONCE_API_URL,
} from 'constants/boardroom';
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
	walletAddress: string | null | undefined;
	uuid: string | null;
	setUuid: (value: string | null) => void;
	ensName: string | null;
	ensAvatar: string | null;
	provider: ethers.providers.JsonRpcProvider | null;
	signer: ethers.providers.JsonRpcSigner | null;
	chainId: number | undefined;
	connectWallet: () => void;
	disconnectWallet: () => void;
	boardroomSignIn: () => Promise<string | undefined>;
	boardroomSignOut: () => void;
	L1DefaultProvider: ethers.providers.InfuraProvider;
	L2DefaultProvider: ethers.providers.InfuraProvider;
};

const ConnectorContext = createContext<unknown>(null);

export const useConnectorContext = () => {
	return useContext(ConnectorContext) as ConnectorContextType;
};

export const ConnectorContextProvider: React.FC = ({ children }) => {
	const { activateBrowserWallet, account, deactivate, library, chainId } = useEthers();

	const L1DefaultProvider = useMemo(
		() => new ethers.providers.InfuraProvider(1, process.env.NEXT_INFURA_PROJECT_ID),
		[]
	);
	const L2DefaultProvider = useMemo(
		() => new ethers.providers.InfuraProvider(10, process.env.NEXT_INFURA_PROJECT_ID),
		[]
	);

	const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider | null>(null);
	const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
	const [ensName, setEnsName] = useState<string | null>(null);
	const [ensAvatar, setEnsAvatar] = useState<string | null>(null);
	const [uuid, setUuid] = useLocalStorage<string | null>('uuid', null);

	useEffect(() => {
		if (library) {
			setProvider(library);
			setSigner(library.getSigner());
		}
	}, [library]);

	useEffect(() => {
		if (account) {
			const setUserAddress = async (address: string) => {
				try {
					const ensName: string | null =
						chainId === 1 && provider
							? await provider.lookupAddress(address)
							: await L1DefaultProvider.lookupAddress(address);
					let avatar = ensName ? await L1DefaultProvider.getAvatar(ensName) : null;
					setEnsName(ensName);
					setEnsAvatar(avatar);
				} catch (error) {
					console.log('No ENS found for address: ', address);
					console.error(error);
				}
			};
			setUserAddress(account);
		}
	}, [account, provider, chainId, L1DefaultProvider]);

	const boardroomSignIn = async () => {
		// @TODO: change to real domain on prod
		const domain = 'localhost:3000';

		const chainId = 31337;

		if (signer && provider && account) {
			try {
				const body = {
					address: account,
				};
				let response = await fetch(NONCE_API_URL, {
					method: 'POST',
					body: JSON.stringify(body),
				});
				const nonceResponse: NonceResponse = await response.json();

				let signedMessage = new SiweMessage({
					domain: domain,
					address: account,
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

				const signInResponse: SignInResponse = await response.json();

				setUuid(signInResponse.data.uuid);

				return signInResponse.data.uuid;
			} catch (e) {
				console.log(e);
			}
		}
	};

	const boardroomSignOut = async () => {
		if (account && uuid) {
			try {
				const body = {
					address: account,
					uuid: uuid,
				};
				let response = await fetch(BOARDROOM_SIGNOUT_API_URL, {
					method: 'POST',
					body: JSON.stringify(body),
				});

				const { data }: SignOutResponse = await response.json();

				if (data.success) {
					setUuid(null);
				}
			} catch (e) {
				console.log(e);
			}
		}
	};

	const connectWallet = async () => {
		try {
			activateBrowserWallet();
		} catch (e) {
			console.log(e);
		}
	};

	const disconnectWallet = async () => {
		try {
			deactivate();
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<ConnectorContext.Provider
			value={{
				walletAddress: account,
				uuid,
				setUuid,
				ensName,
				ensAvatar,
				provider,
				signer,
				chainId,
				connectWallet,
				disconnectWallet,
				boardroomSignIn,
				boardroomSignOut,
				L1DefaultProvider,
				L2DefaultProvider,
			}}
		>
			{children}
		</ConnectorContext.Provider>
	);
};
