import { useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import { createContainer } from 'unstated-next';

const useConnector = () => {
	const { activateBrowserWallet, account, deactivate, library, chainId } = useEthers();

	const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider | null>(null);
	const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);

	useEffect(() => {
		if (library) {
			setProvider(library);
			setSigner(library.getSigner());
		}
	}, [library]);

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
		account,
		provider,
		signer,
		chainId,
		connectWallet,
		disconnectWallet,
	};
};

const Connector = createContainer(useConnector);

export default Connector;
