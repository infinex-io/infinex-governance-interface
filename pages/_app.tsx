import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';

import Header from '../components/Header';
import Footer from '../components/Footer';

import '../styles/globals.css';
import '../i18n';
import { createQueryContext, ElectionModuleContextProvider } from 'context/ElectionModuleContext';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
	// @TODO implement setting up the provider and signers
	const { provider, signer, network, L1DefaultProvider }: any = {};
	return (
		<ElectionModuleContextProvider
			value={
				provider && network?.id
					? createQueryContext({
							provider: provider,
							signer: signer || undefined,
							networkId: network.id,
					  })
					: createQueryContext({
							networkId: 1,
							provider: L1DefaultProvider,
					  })
			}
		>
			<QueryClientProvider client={queryClient}>
				<Header />
				<Component {...pageProps} />
				<Footer />
			</QueryClientProvider>
		</ElectionModuleContextProvider>
	);
}

export default MyApp;
