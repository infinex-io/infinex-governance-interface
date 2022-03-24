import type { NextPage } from 'next';
import Head from 'next/head';
import styled from 'styled-components';
import { theme } from '@synthetixio/ui/dist/esm/styles';

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<StyledMain>test</StyledMain>
		</>
	);
};

const StyledMain = styled.main`
	background-image: url('/images/landing-page-background.svg');
	background-color: ${theme.colors.backgroundColor};
	color: white;
`;

export default Home;
