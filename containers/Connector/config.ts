import { getChainIdHex, getInfuraRpcURL } from 'utils/infura';
import { NetworkIdByName } from '@synthetixio/contracts-interface';
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import coinbaseWalletModule from '@web3-onboard/coinbase';
import walletConnectModule from '@web3-onboard/walletconnect';
import ledgerModule from '@web3-onboard/ledger';
import trezorModule from '@web3-onboard/trezor';
import portisModule from '@web3-onboard/portis';
import torusModule from '@web3-onboard/torus';
import { InfinexIcon, InfinexLogo } from 'components/Wallet/WalletComponents';

const injected = injectedModule();
const coinbaseWalletSdk = coinbaseWalletModule({ darkMode: true });
const walletConnect = walletConnectModule({
	projectId: '9d0b83899b404dafc710e9978dd8fa57',
	version: 2
});
const ledger = ledgerModule() as any;
const trezor = trezorModule({ email: 'info@synthetix.io', appUrl: 'https://infinex.io' });
const portis = portisModule({ apiKey: `${process.env.NEXT_PUBLIC_PORTIS_APP_ID}` });
const torus = torusModule();

export const onboard = Onboard({
	appMetadata: {
		name: 'Infinex',
		icon: InfinexIcon,
		logo: InfinexLogo,
		description: 'Infinex | The Gateway to DeFi.',
		recommendedInjectedWallets: [
			{ name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
			{ name: 'MetaMask', url: 'https://metamask.io' },
		],
		gettingStartedGuide: 'https://infinex.io',
		explore: 'https://mirror.xyz/infinex.eth',
	},
	apiKey: process.env.NEXT_PUBLIC_BN_ONBOARD_API_KEY,
	wallets: [injected, ledger, coinbaseWalletSdk, walletConnect, trezor, portis, torus],
	chains: [
		// Mainnet Ovm
		{
			id: getChainIdHex(NetworkIdByName['mainnet-ovm']),
			token: 'ETH',
			label: 'Optimism Mainnet',
			rpcUrl: getInfuraRpcURL(NetworkIdByName['mainnet-ovm']),
		},
		{
			id: getChainIdHex(NetworkIdByName['mainnet']),
			token: 'ETH',
			label: 'Mainnet',
			rpcUrl: getInfuraRpcURL(NetworkIdByName['mainnet']),
		},
		{
			id: getChainIdHex(NetworkIdByName['goerli']),
			token: 'ETH',
			label: 'Goerli',
			rpcUrl: getInfuraRpcURL(NetworkIdByName['goerli']),
		},
	],
	accountCenter: {
		desktop: {
			enabled: false,
			containerElement: 'body',
		},
		mobile: {
			enabled: false,
			containerElement: 'body',
		},
	},
	notify: {
		enabled: false,
	},
});
