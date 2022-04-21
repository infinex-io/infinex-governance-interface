import type { NextPage } from 'next';
import Head from 'next/head';
import styled from 'styled-components';
import Dashboard from '../sections/dashboard';

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<StyledMain>
				<Dashboard />
			</StyledMain>
		</>
	);
};

const StyledMain = styled.main`
	background-image: url('/images/landing-page-background.svg');
	background-color: ${({ theme }) => theme.colors.backgroundColor};
	color: white;
`;

export default Home;
