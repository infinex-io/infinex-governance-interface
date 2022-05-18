import Main from 'components/Main';
import Error from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProfileSection from 'components/Profile';
import { isWalletAddress } from 'utils/validate';

export default function Profile() {
	const { query } = useRouter();
	const { address } = query;
	if (typeof address !== 'string' || !isWalletAddress(address)) {
		return <Error statusCode={404} />;
	}

	return (
		<>
			<Head>
				<title>Synthetix | {address}</title>
			</Head>
			<Main>
				<ProfileSection walletAddress={address} />
			</Main>
		</>
	);
}
