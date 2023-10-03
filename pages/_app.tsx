import { AppProps } from 'next/app';
import { FC } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';

import { QueryClient, QueryClientProvider } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';

import Header from '../components/Header';
import Footer from '../components/Footer';

import '@synthetixio/ui/dist/fonts/index.scss';
import '../styles/index.scss';
import '../i18n';

import { ConnectorContextProvider, useConnectorContext } from 'containers/Connector';
import { ModulesProvider } from 'containers/Modules';
import { ModalContextProvider, useModalContext } from 'containers/Modal';
import { TransactionDialogContextProvider } from '@synthetixio/ui';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'components/Modals/Modal';
import SafeProvider from '@gnosis.pm/safe-apps-react-sdk';
import { theme } from '@synthetixio/v3-theme';

const queryClient = new QueryClient();

const InnerApp: FC<AppProps> = ({ Component, pageProps }) => {
	const { isOpen, content } = useModalContext();
	const { L2DefaultProvider, signer } = useConnectorContext();
	const TheComponent = Component as any;

	return (
		<ModulesProvider>
			<TransactionDialogContextProvider provider={signer?.provider || L2DefaultProvider}>
				<SafeProvider>
					<Modal open={isOpen} modalContent={content}>
						<Header />
						<TheComponent {...pageProps} />
						<Footer />
					</Modal>
				</SafeProvider>
			</TransactionDialogContextProvider>
			<ToastContainer theme="dark" />
		</ModulesProvider>
	);
};

const App: FC<AppProps> = (props) => {
	return (
		<ChakraProvider theme={theme}>
			<ConnectorContextProvider>
				<QueryClientProvider client={queryClient}>
					<ReactQueryDevtools initialIsOpen={false} />
					<ModalContextProvider>
						<InnerApp {...props} />
					</ModalContextProvider>
				</QueryClientProvider>
			</ConnectorContextProvider>
		</ChakraProvider>
	);
};

export default App;
