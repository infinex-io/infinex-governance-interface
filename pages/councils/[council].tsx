import BackButton from 'components/BackButton';
import NominateSelfBanner from 'components/Banners/NominateSelfBanner';
import Main from 'components/Main';
import MemberCard from 'components/MemberCard/Index';
import { useConnectorContext } from 'containers/Connector';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useUsersDetailsQuery from 'queries/boardroom/useUsersDetailsQuery';
import useIsNominated from 'queries/nomination/useIsNominatedQuery';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from 'utils/capitalize';
import { parseQuery } from 'utils/parse';

export default function CouncilNominees() {
	const { query, push } = useRouter();
	const { t } = useTranslation();
	const { walletAddress } = useConnectorContext();
	const { data } = useNomineesQuery(parseQuery(query?.council?.toString()).module);
	const isNominated = useIsNominated(
		parseQuery(query?.council?.toString()).module,
		walletAddress ? walletAddress : ''
	);
	const nomineesInfo = useUsersDetailsQuery(data ? data : []);
	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				{!isNominated.data && <NominateSelfBanner />}
				<BackButton />
				<h1 className="tg-title-h1 text-center">
					{t('councils.nominees', { council: capitalizeString(query.council?.toString()) })}
				</h1>
				{!!nomineesInfo.data?.length ? (
					<div className="flex justify-center flex-wrap">
						{nomineesInfo.data.map((member) => (
							<MemberCard
								member={member}
								key={member.address}
								onClick={() => push('/profile/' + member.address)}
							/>
						))}
					</div>
				) : (
					<h4 className="tg-title-h4 text-center">{t('councils.no-nominations')}</h4>
				)}
			</Main>
		</>
	);
}
