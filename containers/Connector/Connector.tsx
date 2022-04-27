import { useEffect, useState } from 'react';
import { Hardhat, useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import { createContainer } from 'unstated-next';

const useConnector = () => {
	const { activateBrowserWallet, account, deactivate, library, chainId } = useEthers();

	const L1DefaultProvider = new ethers.providers.InfuraProvider(
		'mainnet',
		process.env.NEXT_INFURA_PROJECT_ID
	);
	const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider | null>(null);
	const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
	const [ensName, setEnsName] = useState<string | null>(null);
	const [ensAvatar, setEnsAvatar] = useState<string | null>(null);
	const [uuid, setUuid] = useState<string | null>(null);

	// check if user has a stored uuid and if it is valid
	useEffect(() => {
		setUuid(null);
	}, []);

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
	}, [account, provider]);

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

	return {
		walletAddress: account,
		uuid,
		ensName,
		ensAvatar,
		provider,
		signer,
		chainId,
		connectWallet,
		disconnectWallet,
		L1DefaultProvider,
	};
};

const Connector = createContainer(useConnector);

export default Connector;
