import { AppProps } from 'next/app';
import { FC } from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';
import { DAppProvider, Config, Localhost } from '@usedapp/core';

import Header from '../components/Header';
import Footer from '../components/Footer';

import '../styles/globals.css';
import '../i18n';

import { createQueryContext, ElectionModuleContextProvider } from 'context/ElectionModuleContext';
import Connector from 'containers/Connector';
import { ethers } from 'ethers';

const queryClient = new QueryClient();

const DEFAULT_NETWORK = 31337;
const LOCAL_HOST_URL = 'http://127.0.0.1:8545';

// @TODO: change to main-net ovm when prod
export const config: Config = {
	readOnlyChainId: Localhost.chainId,
	readOnlyUrls: {
		[Localhost.chainId]: LOCAL_HOST_URL,
	},
};

const InnerApp: FC<AppProps> = ({ Component, pageProps }) => {
	const { provider, signer, chainId } = Connector.useContainer();
	return (
		<ElectionModuleContextProvider
			value={
				provider && signer && typeof chainId === 'number'
					? createQueryContext({
							provider: provider,
							signer: signer || undefined,
							networkId: chainId,
					  })
					: createQueryContext({
							networkId: DEFAULT_NETWORK,
							provider: new ethers.providers.JsonRpcProvider(LOCAL_HOST_URL),
					  })
			}
		>
			<Header />
			<Component {...pageProps} />
			<Footer />
		</ElectionModuleContextProvider>
	);
};

const App: FC<AppProps> = (props) => {
	return (
		<DAppProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<InnerApp {...props} />
			</QueryClientProvider>
		</DAppProvider>
	);
};

export default App;
