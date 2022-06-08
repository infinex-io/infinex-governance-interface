import Main from 'components/Main';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProfileSection from 'components/Profile';
import { isWalletAddress } from 'utils/validate';
import { Text } from 'components/Text/text';
import { t } from 'i18next';
import { Loader } from 'components/Loader/Loader';

export default function Profile() {
	const router = useRouter();
	const { address } = router.query;

	return (
		<>
			<Head>
				<title>Synthetix | {address ? address : 'Profile'}</title>
			</Head>
			<Main>
				{router.isReady ? (
					typeof address === 'string' && isWalletAddress(address) ? (
						<ProfileSection walletAddress={address} />
					) : (
						<div className="flex flex-col align-center gap-4">
							<h1 className="tg-title-h1 c text-center">
								{t('profiles.profile-not-found.header')}
							</h1>
							<Text>
								{t(`profiles.profile-not-found.subheadline`, {
									walletAddress: address,
								})}
							</Text>
						</div>
					)
				) : (
					<Loader fullScreen />
				)}
			</Main>
		</>
	);
}
