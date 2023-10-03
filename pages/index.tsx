import { useColorMode } from '@chakra-ui/react';
import LandingPage from 'components/LandingPage';
import Main from 'components/Main';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import useUserVolumeQuery, { GetUserVolume } from 'queries/farming/useUserVolumeQuery';


const Home: NextPage = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const userVolumeQuery = useUserVolumeQuery("0xa169e0081a995fbd9ef5c156df93add9680f6029");

	useEffect(() => {
		if (colorMode === 'light') {
			toggleColorMode();
		}
	}, [colorMode, toggleColorMode]);

	useEffect(() => {
		if (userVolumeQuery.isSuccess) {
			const userVolume = userVolumeQuery.data as GetUserVolume;
			console.log("user volume: ",userVolume)
		}
	}, [userVolumeQuery]);

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
