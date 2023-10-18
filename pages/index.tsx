import LandingPage from 'components/LandingPage';
import Main from 'components/Main';
import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Infinex | Governance</title>
				<meta
					property="og:image"
					content="https://lh3.googleusercontent.com/drive-viewer/AK7aPaCE_y8rdsV8bJjzGkeHTlL8ZhHdTn78UyxmUPiXUCn_WZ1h_clgmeiUbY3DC-OUV20V1uMMDWgWW6IYMPE1xBt_U4JRhg=s1600"
				/>
			</Head>
			<Main>
				<LandingPage />
			</Main>
		</>
	);
};

export default Home;
