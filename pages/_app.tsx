import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';

import Header from '../components/Header';
import Footer from '../components/Footer';

import '../styles/globals.css';
import '../i18n';

// Create a client
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient} {...pageProps}>
			<Header />
			<Component />
			<Footer />
		</QueryClientProvider>
	);
}

export default MyApp;
