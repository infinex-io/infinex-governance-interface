import type { NextPage } from 'next';
import Head from 'next/head';
import Main from 'components/Main';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import { DeployedModules } from 'containers/Modules/Modules';
import ElectedMembers from 'sections/administration/ElectedMembers';
import CurrentElections from 'sections/nominations/CurrentElections';

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
	period = 'NOMINATION';
	switch (period) {
		case 'ADMINISTRATION':
			return <ElectedMembers />;
		case 'NOMINATION':
			return <CurrentElections />;
		case 'VOTING':
			return <></>;
		case 'EVALUATION':
			return;
		default:
			return;
	}
};

export default Elections;
