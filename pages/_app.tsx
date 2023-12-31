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
import { ModalFarmingContextProvider, useModalFarmingContext } from 'containers/EmailModalContext';
import { TransactionDialogContextProvider } from '@synthetixio/ui';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'components/Modals/Modal';
import SafeProvider from '@gnosis.pm/safe-apps-react-sdk';
import { theme } from '@synthetixio/v3-theme';
import { useRouter } from 'next/router';
import EmailModal from 'components/LockingRoom/EmailModal';

const queryClient = new QueryClient();

const InnerApp: FC<AppProps> = ({ Component, pageProps }) => {
	const { isOpen, content } = useModalContext();
	const { modalFarmingIsHidden, setModalFarmingIsHidden, signatureData, loggedIn } = useModalFarmingContext();
	const { L2DefaultProvider, signer } = useConnectorContext();
	const TheComponent = Component as any;
	const { asPath } = useRouter();

	return (
		<ModulesProvider>
			<TransactionDialogContextProvider provider={signer?.provider || L2DefaultProvider}>
				<SafeProvider>
					<Modal open={isOpen} modalContent={content}>
						<EmailModal
							hidden={modalFarmingIsHidden}
							setHidden={setModalFarmingIsHidden}
							signature={signatureData.signature}
							address={signatureData.address}
							loggedIn={loggedIn}
						/>
						<div className="min-h-screen flex flex-col justify-between">
							<Header />
							<TheComponent {...pageProps} />
							<Footer />
							<style jsx global>{`
								body,
								html {
									background: ${asPath.includes('farming')
										? '#ffcfb6 !important'
										: '#05060A !important'};
								}
							`}</style>
						</div>
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
					<ModalFarmingContextProvider>
						<ModalContextProvider>
							<InnerApp {...props} />
						</ModalContextProvider>
					</ModalFarmingContextProvider>
				</QueryClientProvider>
			</ConnectorContextProvider>
		</ChakraProvider>
	);
};

export default App;
