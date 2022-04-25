import type { NextPage } from 'next';
import Head from 'next/head';
import ElectionsSections from 'sections/Elections/index';
import Main from 'components/Main';

const Elections: NextPage = () => {
	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				<ElectionsSections />
			</Main>
		</>
	);
};

export default Elections;
