import BackButton from 'components/BackButton';
import NominateSelfBanner from 'components/Banners/NominateSelfBanner';
import { Loader } from 'components/Loader/Loader';
import Main from 'components/Main';
import MemberCard from 'components/MemberCard/Index';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useUsersDetailsQuery from 'queries/boardroom/useUsersDetailsQuery';
import useIsNominated from 'queries/nomination/useIsNominatedQuery';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from 'utils/capitalize';
import { parseQuery } from 'utils/parse';
import { useAccount } from 'wagmi';

export default function CouncilNominees() {
	const { query } = useRouter();
	const { t } = useTranslation();
	const { data } = useAccount();
	const activeCouncil = parseQuery(query?.council?.toString());
	const nomineesQuery = useNomineesQuery(activeCouncil.module);
	const isNominated = useIsNominated(activeCouncil.module, data?.address || '');
	const nomineesInfo = useUsersDetailsQuery(nomineesQuery.data || []);

	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				{typeof isNominated.data !== 'undefined' && !isNominated.data && <NominateSelfBanner />}
				<BackButton />
				<h1 className="tg-title-h1 text-center">
					{t('councils.nominees', { council: capitalizeString(query.council?.toString()) })}
				</h1>
				{nomineesInfo.isLoading ? (
					<Loader className="flex justify-center" />
				) : !!nomineesInfo.data?.length ? (
					<div className="flex flex-wrap justify-center">
						{nomineesInfo.data.map((member) => (
							<MemberCard
								className="m-2"
								member={member}
								key={member.address}
								state="NOMINATION"
								deployedModule={activeCouncil.module}
								council={activeCouncil.name}
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
