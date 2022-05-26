import BackButton from 'components/BackButton';
import NominateSelfBanner from 'components/Banners/NominateSelfBanner';
import Main from 'components/Main';
import MemberCard from 'components/MemberCard/Index';
import { useConnectorContext } from 'containers/Connector';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useUsersDetailsQuery, { GetUserDetails } from 'queries/boardroom/useUsersDetailsQuery';
import useIsNominated from 'queries/nomination/useIsNominatedQuery';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from 'utils/capitalize';
import { parseQuery } from 'utils/parse';

export default function CouncilNominees() {
	const { query } = useRouter();
	const { t } = useTranslation();
	const { walletAddress } = useConnectorContext();
	const activeCouncil = parseQuery(query?.council?.toString());
	const [councilNominees, setCouncilNominees] = useState<GetUserDetails[]>([]);
	const { data } = useNomineesQuery(activeCouncil.module);
	const isNominated = useIsNominated(activeCouncil.module, walletAddress ? walletAddress : '');
	const nomineesInfo = useUsersDetailsQuery(data ? data : []);
	useEffect(() => {
		if (nomineesInfo.data?.length) setCouncilNominees(nomineesInfo.data);
	}, [nomineesInfo]);

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
				{!!councilNominees.length ? (
					<div className="flex flex-wrap justify-center">
						{councilNominees.map((member) => (
							<MemberCard
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
