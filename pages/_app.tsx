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

const queryClient = new QueryClient();

const InnerApp: FC<AppProps> = ({ Component, pageProps }) => {
	const { isOpen, content } = useModalContext();
	const { L2DefaultProvider, provider } = useConnectorContext();

	const TheComponent = Component as any;
	// provider ? provider :  set correct provider when done migrating TODO @DEV
	return (
		<ModulesProvider>
			<TransactionDialogContextProvider provider={L2DefaultProvider}>
				<Header />
				<UIModal open={isOpen} modalContent={content}>
					<TheComponent {...pageProps} />
					<Footer />
				</UIModal>
			</TransactionDialogContextProvider>
		</ModulesProvider>
	);
};

const App: FC<AppProps> = (props) => {
	return (
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
	);
};

export default App;
