import { AppProps } from 'next/app';
import { FC } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';

import { QueryClient, QueryClientProvider } from 'react-query';

import Header from '../components/Header';
import Footer from '../components/Footer';

import '@synthetixio/ui/dist/default.css';
import '../styles/index.scss';
import '../i18n';

import { ConnectorContextProvider, useConnectorContext } from 'containers/Connector';
import { ModulesProvider } from 'containers/Modules';
import { ModalContextProvider, useModalContext } from 'containers/Modal';
import { ThemeProvider } from 'styled-components';
import { theme, Modal as UIModal } from 'components/old-ui';
import { TransactionDialogContextProvider } from '@synthetixio/ui';
import { useSigner } from 'wagmi';

import '@rainbow-me/rainbowkit/styles.css';
import {
	RainbowKitProvider,
	connectorsForWallets,
	wallet,
	darkTheme,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { publicProvider } from 'wagmi/providers/public';
const { chains, provider } = configureChains(
	[chain.optimism],
	[
		infuraProvider({ infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID }),
		publicProvider({ pollingInterval: 5000 }),
	]
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

const queryClient = new QueryClient();

const InnerApp: FC<AppProps> = ({ Component, pageProps }) => {
	const { isOpen, content } = useModalContext();
	const { L2DefaultProvider } = useConnectorContext();
	const { data: signer } = useSigner();
	const TheComponent = Component as any;

	return (
		<ModulesProvider>
			<TransactionDialogContextProvider provider={signer?.provider || L2DefaultProvider}>
				<Header />
				<UIModal open={isOpen} modalContent={content}>
					<TheComponent {...pageProps} />
					<Footer />
				</UIModal>
			</TransactionDialogContextProvider>
			<ToastContainer theme="dark" />
		</ModulesProvider>
	);
};

const App: FC<AppProps> = (props) => {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider
				chains={chains}
				theme={darkTheme({
					accentColor: 'linear-gradient(73.6deg, #85FFC4 2.11%, #5CC6FF 90.45%)',
					accentColorForeground: '#000',
					borderRadius: 'medium',
					fontStack: 'rounded',
				})}
			>
				<ConnectorContextProvider>
					<QueryClientProvider client={queryClient}>
						<ReactQueryDevtools initialIsOpen={false} />
						<ThemeProvider theme={theme}>
							<ModalContextProvider>
								<InnerApp {...props} />
							</ModalContextProvider>
						</ThemeProvider>
					</QueryClientProvider>
				</ConnectorContextProvider>
			</RainbowKitProvider>
		</WagmiConfig>
	);
};

export default App;
