import type { NextPage } from 'next';
import Head from 'next/head';
import Main from 'components/Main';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import { DeployedModules } from 'containers/Modules/Modules';
import NominationsLandingPage from 'sections/nominations';
import ElectedMembers from 'sections/administration/ElectedMembers';

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
	switch (period) {
		case 'ADMINISTRATION':
			return <ElectedMembers />;
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
