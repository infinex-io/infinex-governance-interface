import Main from 'components/Main';
import { DeployedModules } from 'containers/Modules/Modules';
import type { NextPage } from 'next';
import Head from 'next/head';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import AdministrationLandingPage from 'sections/administration';
import VoteLandingPage from 'sections/vote';
import NominationsLandingPage from 'sections/nominations';

const Home: NextPage = () => {
	const { data } = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);

	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>{data?.currentPeriod && determineSection(data.currentPeriod)}</Main>
		</>
	);
};

const determineSection = (period: string) => {
	period = 'ADMINISTRATION';
	switch (period) {
		case 'ADMINISTRATION':
			return <AdministrationLandingPage />;
		case 'NOMINATION':
			return <NominationsLandingPage />;
		case 'VOTING':
			return <VoteLandingPage />;
		case 'EVALUATION':
			return;
		default:
			return;
	}
};

export default Home;
