import { providers } from 'ethers';
import { loadProvider } from '@synthetixio/providers';
import { NetworkIdByName, NetworkId } from '@synthetixio/contracts-interface';
import { Subscriptions, WalletType } from 'bnc-onboard/dist/src/interfaces';
import onboard from 'bnc-onboard';
import { getInfuraRpcURL } from '../utils/infura';

export function useConnector() {
	const L1DefaultProvider: providers.InfuraProvider = loadProvider({
		infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
		networkId: NetworkIdByName.mainnet,
	});
	const L2DefaultProvider: providers.InfuraProvider = loadProvider({
		infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
		networkId: NetworkIdByName['mainnet-ovm'],
	});
}

export const initOnboard = (networkId: NetworkId, subscriptions: Subscriptions) => {
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
