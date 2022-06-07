import Main from 'components/Main';
import Error from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProfileSection from 'components/Profile';
import { isWalletAddress } from 'utils/validate';

export default function Profile() {
	const { query } = useRouter();
	const { address } = query;

	return (
		<>
			<Head>
				<title>Synthetix | {address ? address : 'Profile'}</title>
			</Head>
			<Main>
				{typeof address === 'string' && isWalletAddress(address) && (
					<ProfileSection walletAddress={address} />
				)}
			</Main>
		</>
	);
}
