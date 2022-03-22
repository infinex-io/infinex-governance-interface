import { providers, Signer } from 'ethers';
import { loadProvider } from '@synthetixio/providers';
import {
	NetworkIdByName,
	NetworkId,
	synthetix,
	SynthetixJS,
} from '@synthetixio/contracts-interface';
import { Subscriptions, WalletType } from 'bnc-onboard/dist/src/interfaces';
import onboard from 'bnc-onboard';
import { getInfuraRpcURL } from '../utils/infura';
import { useEffect, useState } from 'react';
import { getIsOVM, isSupportedNetworkId, Network } from '../utils/network';
import { switchToL1 } from '@synthetixio/optimism-networks';
import {
	TransactionNotifier,
	TransactionNotifierInterface,
} from '@synthetixio/transaction-notifier';
import { Wallet as OnboardWallet } from 'bnc-onboard/dist/src/interfaces';

export function useConnector() {
	const [network, setNetwork] = useState<null | Network>(null);
	const [provider, setProvider] = useState<providers.Provider | null>(null);
	const [signer, setSigner] = useState<Signer | null>(null);
	const [synthetixjs, setSynthetixjs] = useState<SynthetixJS | null>(null);
	const L1DefaultProvider: providers.InfuraProvider = loadProvider({
		infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
		networkId: NetworkIdByName.mainnet,
	});
	const L2DefaultProvider: providers.InfuraProvider = loadProvider({
		infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
		networkId: NetworkIdByName['mainnet-ovm'],
	});
	const [onboard, setOnboard] = useState<ReturnType<typeof initOnboard> | null>(null);
	const [walletAddress, setWalletAddress] = useState<string | null>(null);

	const [ensName, setEnsName] = useState<string | null>(null);
	const [ensAvatar, setEnsAvatar] = useState<string | null>(null);
	const [watchWallet, setWatchWallet] = useState<string | null>(null);
	const [transactionNotifier, setTransactionNotifier] =
		useState<TransactionNotifierInterface | null>(null);

	const setUserAddress = async (address: string) => {
		setWalletAddress(address);
		if (address) {
			const ensName: string | null = await L1DefaultProvider.lookupAddress(
				'0x01d79bceaeaadfb8fd2f2f53005289cfcf483464'
			);
			let avatar = ensName ? await L1DefaultProvider.getAvatar(ensName) : null;
			setEnsName(ensName);
			setEnsAvatar(avatar);
		}
	};
	const connectWallet = async () => {
		try {
			if (onboard) {
				onboard.walletReset();
				const success = await onboard.walletSelect();
				if (success) {
					await onboard.walletCheck();
				}
			} else {
				const onboard = initOnboard(1, {
					address: setUserAddress,
					network: (networkId) => {
						if (!networkId) return; // user disconnected the wallet

						if (!isSupportedNetworkId(networkId)) {
							if (window.ethereum) {
								switchToL1({ ethereum: window.ethereum });
							}
							// We can return here since the network change will trigger this callback again
							return;
						}

						const provider = loadProvider({
							provider: onboard.getState().wallet.provider,
						});
						const signer = provider.getSigner();
						const useOvm = getIsOVM(networkId);

						const snxjs = synthetix({
							provider,
							networkId: networkId as NetworkId,
							signer,
							useOvm,
						});

						onboard.config({ networkId });
						if (transactionNotifier) {
							transactionNotifier.setProvider(provider);
						} else {
							setTransactionNotifier(new TransactionNotifier(provider));
						}
						setProvider(provider);
						setSynthetixjs(snxjs);
						setSigner(signer);
						setNetwork(snxjs.network);
					},
					wallet: async (wallet: OnboardWallet) => {
						if (wallet.provider) {
							const provider = loadProvider({ provider: wallet.provider });
							const network = await provider.getNetwork();
							const networkId = Number(network.chainId);
							if (!isSupportedNetworkId(networkId)) {
								if (window.ethereum) {
									await switchToL1({ ethereum: window.ethereum });
								}
								// We return here and expect the network change to trigger onboard's network callback
								return;
							}
							const useOvm = getIsOVM(Number(networkId));

							const snxjs = synthetix({
								provider,
								networkId,
								signer: provider.getSigner(),
								useOvm,
							});

							setProvider(provider);
							setSigner(provider.getSigner());
							setSynthetixjs(snxjs);
							setNetwork(snxjs.network);
							setTransactionNotifier(new TransactionNotifier(provider));
						} else {
							setProvider(null);
							setSigner(null);
							setWalletAddress(null);
						}
					},
				});
				setOnboard(onboard);
				onboard.walletReset();
				const success = await onboard.walletSelect();
				if (success) {
					await onboard.walletCheck();
				}
			}
		} catch (e) {
			console.log(e);
		}
	};

	return { connectWallet, ensAvatar, ensName, provider, walletAddress };
}

const initOnboard = (networkId: NetworkId, subscriptions: Subscriptions) => {
	return onboard({
		dappId: process.env.NEXT_PUBLIC_BN_ONBOARD_API_KEY,
		hideBranding: true,
		networkId: Number(networkId),
		subscriptions,
		darkMode: true,
		walletSelect: {
			wallets: [
				{
					name: 'Browser Wallet',
					iconSrc: '/images/browserWallet.svg',
					type: 'injected' as WalletType,
					link: 'https://metamask.io',
					wallet: async (helpers) => {
						const { createModernProviderInterface } = helpers;
						const provider = window.ethereum;
						return {
							provider,
							interface: provider ? createModernProviderInterface(provider) : null,
						};
					},
					preferred: true,
					desktop: true,
					mobile: true,
				},
				{
					walletName: 'lattice',
					appName: 'Synthetix',
					rpcUrl: loadProvider({
						infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
						networkId,
					}),
				},
				{
					walletName: 'ledger',
					rpcUrl: loadProvider({
						infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
						networkId,
					}),
					preferred: true,
				},
				{
					walletName: 'trezor',
					appUrl: 'https://www.synthetix.io',
					email: 'info@synthetix.io',
					rpcUrl: loadProvider({
						infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
						networkId,
					}),
					preferred: true,
				},
				{
					walletName: 'walletConnect',
					rpc: {
						[NetworkIdByName.mainnet]: getInfuraRpcURL(NetworkIdByName.mainnet),
						[NetworkIdByName['mainnet-ovm']]: getInfuraRpcURL(NetworkIdByName['mainnet-ovm']),
						[NetworkIdByName['kovan']]: getInfuraRpcURL(NetworkIdByName['kovan']),
						[NetworkIdByName['kovan-ovm']]: getInfuraRpcURL(NetworkIdByName['kovan-ovm']),
					},
					preferred: true,
				},
				{
					walletName: 'imToken',
					rpcUrl: loadProvider({
						infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,

						networkId,
					}),
					preferred: true,
				},
				{
					walletName: 'portis',
					apiKey: process.env.NEXT_PUBLIC_PORTIS_APP_ID,
				},
				{ walletName: 'gnosis' },
				{
					walletName: 'trust',
					rpcUrl: loadProvider({
						infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,

						networkId,
					}),
				},
				{
					walletName: 'walletLink',
					rpcUrl: loadProvider({
						infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
						networkId,
					}),
					preferred: true,
				},
				{ walletName: 'torus' },
				{ walletName: 'status' },
				{ walletName: 'authereum' },
				{ walletName: 'tally', preferred: true },
			],
		},
		walletCheck: [
			{ checkName: 'derivationPath' },
			{ checkName: 'accounts' },
			{ checkName: 'connect' },
		],
	});
};
