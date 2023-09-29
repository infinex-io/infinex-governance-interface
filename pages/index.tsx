import { useColorMode } from '@chakra-ui/react';
import LandingPage from 'components/LandingPage';
import Main from 'components/Main';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';

const Home: NextPage = () => {
	const { colorMode, toggleColorMode } = useColorMode();

	useEffect(() => {
		if (colorMode === 'light') {
			toggleColorMode();
		}
	}, [colorMode, toggleColorMode]);

	return (
		<>
			<Head>
				<title>Infinex | Governance V3</title>
			</Head>
			<Main>
				<LandingPage />
			</Main>
		</>
	);
};

export default Home;
