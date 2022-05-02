import type { NextPage } from 'next';
import Head from 'next/head';
import ElectionsSection from 'sections/elections/index';
import Main from 'components/Main';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import { DeployedModules } from 'containers/Modules/Modules';
import AdministrationLandingPage from 'sections/administration';
import VoteLandingPage from 'sections/vote';
import NominationsLandingPage from 'sections/nominations';
import VoteBanner from 'components/VoteBanner';

const Elections: NextPage = () => {
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
	return (
		<>
			<VoteBanner hideButton />
			<ElectionsSection />
		</>
	);
	switch (period) {
		case 'ADMINISTRATION':
			return (
				<>
					<AdministrationLandingPage />
				</>
			);
		case 'NOMINATION':
			return <NominationsLandingPage />;
		case 'VOTING':
			return <></>;
		case 'EVALUATION':
			return;
		default:
			return;
	}
};

export default Elections;
