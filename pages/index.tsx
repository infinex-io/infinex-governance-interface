import Main from 'components/Main';
import NominateSelfBanner from 'components/NominateSelfBanner';
import { DeployedModules } from 'containers/Modules/Modules';
import type { NextPage } from 'next';
import Head from 'next/head';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import Dashboard from '../sections/dashboard';

const Home: NextPage = () => {
	const { data } = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);
	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				{/* TODO @DEV uncomment once prod */}
				{/* {data?.currentPeriod && showBanner(data.currentPeriod) && <NominateSelfBanner />} */}
				<NominateSelfBanner />
				<Dashboard />
			</Main>
		</>
	);
};

export default Home;
