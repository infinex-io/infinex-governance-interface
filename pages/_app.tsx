import { AppProps } from 'next/app';
import { FC } from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';
import { DAppProvider, Config, Hardhat, ChainId } from '@usedapp/core';

import Header from '../components/Header';
import Footer from '../components/Footer';

import '../styles/globals.css';
import '../i18n';

import Connector from 'containers/Connector';
import Modules from 'containers/Modules';
import Modal from 'containers/Modal';
import { ThemeProvider } from 'styled-components';
import { theme, Modal as UIModal } from '@synthetixio/ui';

const queryClient = new QueryClient();

const LOCAL_HOST_URL = 'http://127.0.0.1:8545';

// @TODO: change to main-net ovm when prod
export const config: Config = {
	readOnlyChainId: Hardhat.chainId,
	readOnlyUrls: {
		[Hardhat.chainId]: LOCAL_HOST_URL,
	},
	multicallAddresses: {
		[Hardhat.chainId]: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
	},
	supportedChains: [ChainId.Hardhat],
};

const InnerApp: FC<AppProps> = ({ Component, pageProps }) => {
	const { isOpen, content } = Modal.useContainer();
	return (
		<Modules.Provider>
			<Header />
			{/* TODO @MF remove terniery operator when new version of UI is out */}
			<UIModal open={isOpen} modalContent={content ? content : <span>nothing</span>}>
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
