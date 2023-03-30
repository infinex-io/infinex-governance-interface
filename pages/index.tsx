import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import LandingPage from 'components/LandingPage';
import Main from 'components/Main';
import { useConnectorContext } from 'containers/Connector';
import { AppEvents } from 'containers/Connector/reducer';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';

const Home: NextPage = () => {
	const { connected } = useSafeAppsSDK();
	const { dispatch, L2DefaultProvider } = useConnectorContext();
	useEffect(() => {
		if (connected) {
			dispatch({
				type: AppEvents.UPDATE_PROVIDER,
				payload: {
					provider: L2DefaultProvider as any,
					network: {
						id: 10,
						name: 'mainnet-ovm',
						useOvm: true,
					},
				},
			});
		}
	}, [connected, dispatch, L2DefaultProvider]);
	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				<LandingPage />
			</Main>
		</>
	);
};

export default Home;
