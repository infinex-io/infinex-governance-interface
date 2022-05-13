import LandingPage from 'components/LandingPage';
import Main from 'components/Main';
import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
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
