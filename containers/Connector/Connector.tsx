import React, { useEffect, useMemo, useState, useContext, createContext } from 'react';
import { ethers } from 'ethers';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, connectorsForWallets, wallet } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

type ConnectorContextType = {
	ensName: string | null;
	ensAvatar: string | null;
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

	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider chains={chains}>
				<ConnectorContext.Provider
					value={{
						ensAvatar,
						ensName,
						provider,
						chains,
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
