import { AppProps } from 'next/app';
import { FC } from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';
import { DAppProvider, Config, Hardhat, ChainId, Mainnet } from '@usedapp/core';

import Header from '../components/Header';
import Footer from '../components/Footer';

import '../styles/index.scss';
import '../i18n';

import Connector from 'containers/Connector';
import Modules from 'containers/Modules';
import Modal from 'containers/Modal';
import { ThemeProvider } from 'styled-components';
import { theme, Modal as UIModal } from 'components/old-ui';

const queryClient = new QueryClient();

const LOCAL_HOST_URL = 'http://127.0.0.1:8545';
const MAINNET_URL = 'https://mainnet.infura.io/v3/ab04016a6cd448ed8eae571523b521be';

// @TODO: change to main-net ovm when prod
export const config: Config = {
	readOnlyChainId: Mainnet.chainId,
	readOnlyUrls: {
		[Hardhat.chainId]: LOCAL_HOST_URL,
		[Mainnet.chainId]: MAINNET_URL,
	},
	multicallAddresses: {
		[Hardhat.chainId]: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
	},
	supportedChains: [ChainId.Hardhat, ChainId.Mainnet],
};

const InnerApp: FC<AppProps> = ({ Component, pageProps }) => {
	const { isOpen, content } = Modal.useContainer();
	return (
		<Modules.Provider>
			<Header />
			<UIModal open={isOpen} modalContent={content}>
				<Component {...pageProps} />
				<Footer />
			</UIModal>
		</Modules.Provider>
	);
};

const App: FC<AppProps> = (props) => {
	return (
		<DAppProvider config={config}>
			<Connector.Provider>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider theme={theme}>
						<Modal.Provider>
							<InnerApp {...props} />
						</Modal.Provider>
					</ThemeProvider>
				</QueryClientProvider>
			</Connector.Provider>
		</DAppProvider>
	);
};

export default App;
