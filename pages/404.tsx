import Main from 'components/Main';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

const FourOhFour: NextPage = () => {
	return (
		<>
			<Head>
				<title>404</title>
			</Head>
			<Main>
				<Image src={'/images/404-min.png'} />
			</Main>
		</>
	);
};

export default FourOhFour;
