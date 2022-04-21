import { useEffect, useState } from 'react';
import { Hardhat, useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import { createContainer } from 'unstated-next';

const useConnector = () => {
	const { activateBrowserWallet, account, deactivate, library, chainId } = useEthers();

	const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider | null>(null);
	const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
	const [ensName, setEnsName] = useState<string | null>(null);
	const [ensAvatar, setEnsAvatar] = useState<string | null>(null);

	useEffect(() => {
		if (library) {
			setProvider(library);
			setSigner(library.getSigner());
		}
	}, [library]);

	useEffect(() => {
		if (account && provider) {
			const setUserAddress = async (address: string) => {
				let ensAvatar: string | null = '';
				let ensName: string | null = '';
				if (chainId !== Hardhat.chainId) {
					ensName = await provider.lookupAddress(address);
					ensAvatar = ensName ? await provider.getAvatar(ensName) : null;
				}

				setEnsName(ensName);
				setEnsAvatar(ensAvatar);
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
		ensName,
		ensAvatar,
		provider,
		signer,
		chainId,
		connectWallet,
		disconnectWallet,
	};
};

const Connector = createContainer(useConnector);

export default Connector;
