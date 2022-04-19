import { AppProps } from 'next/app';
import { FC } from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';
import { DAppProvider, Config, Localhost } from '@usedapp/core';

import Header from '../components/Header';
import Footer from '../components/Footer';

import '../styles/globals.css';
import '../i18n';

import Connector from 'containers/Connector';
import Modules from 'containers/Modules';

const queryClient = new QueryClient();

const LOCAL_HOST_URL = 'http://127.0.0.1:8545';
const HARDHAT_LOCALHOST_CHAIN_ID = 31337;

// @TODO: change to main-net ovm when prod
export const config: Config = {
	readOnlyChainId: HARDHAT_LOCALHOST_CHAIN_ID,
	readOnlyUrls: {
		[Localhost.chainId]: LOCAL_HOST_URL,
	},
};

const InnerApp: FC<AppProps> = ({ Component, pageProps }) => {
	return (
		<Modules.Provider>
			<Header />
			<Component {...pageProps} />
			<Footer />
		</Modules.Provider>
	);
};

const App: FC<AppProps> = (props) => {
	return (
		<DAppProvider config={config}>
			<Connector.Provider>
				<QueryClientProvider client={queryClient}>
					<InnerApp {...props} />
				</QueryClientProvider>
			</Connector.Provider>
		</DAppProvider>
	);
};

export default App;
