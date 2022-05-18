import { AppProps } from 'next/app';
import { FC } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';

import { QueryClient, QueryClientProvider } from 'react-query';
import { DAppProvider, Config, Hardhat, Mainnet } from '@usedapp/core';

import Header from '../components/Header';
import Footer from '../components/Footer';

import '@synthetixio/ui/dist/default.css';
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
};

const InnerApp: FC<AppProps> = ({ Component, pageProps }) => {
	const { isOpen, content } = Modal.useContainer();

	//TODO: remove next-unstated
	const Provider = Modules.Provider as any;
	const TheComponent = Component as any;

	return (
		<Provider>
			<Header />
			<UIModal open={isOpen} modalContent={content}>
				<TheComponent {...pageProps} />
				<Footer />
			</UIModal>
		</Provider>
	);
};

const App: FC<AppProps> = (props) => {
	const ConnectorProvider = Connector.Provider as any;
	const ModalProvider = Modal.Provider as any;

	return (
		<DAppProvider config={config}>
			<ConnectorProvider>
				<QueryClientProvider client={queryClient}>
					<ReactQueryDevtools initialIsOpen={false} />
					<ThemeProvider theme={theme}>
						<ModalProvider>
							<InnerApp {...props} />
						</ModalProvider>
					</ThemeProvider>
				</QueryClientProvider>
			</ConnectorProvider>
		</DAppProvider>
	);
};

export default App;
