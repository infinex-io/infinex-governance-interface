import type { NextPage } from 'next';
import Head from 'next/head';
import styled from 'styled-components';
import { theme } from '@synthetixio/ui';
import Dashboard from '../sections/dashboard';

const Home: NextPage = () => {
	if (typeof document !== 'undefined') {
		console.log(document);
	}
	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<StyledMain>{typeof document !== 'undefined' && <Dashboard />}</StyledMain>
		</>
	);
};

const StyledMain = styled.main`
	background-image: url('/images/landing-page-background.svg');
	background-color: ${theme.colors.backgroundColor};
	color: white;
`;

export default Home;
