import VoteBanner from 'components/Banners/VoteBanner';
import { Loader } from 'components/Loader/Loader';
import Main from 'components/Main';
import MemberCard from 'components/MemberCard/Index';
import { useConnectorContext } from 'containers/Connector';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useUsersDetailsQuery from 'queries/boardroom/useUsersDetailsQuery';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useGetCurrentVoteStateQuery } from 'queries/voting/useGetCurrentVoteStateQuery';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from 'utils/capitalize';
import { parseQuery } from 'utils/parse';

export default function VoteCouncil() {
	const { query, push } = useRouter();
	const { t } = useTranslation();
	const activeCouncil = parseQuery(query?.council?.toString());
	const { walletAddress } = useConnectorContext();
	const { data: periodData } = useCurrentPeriod(activeCouncil.module);
	const nomineeQuery = useNomineesQuery(activeCouncil.module);
	const usersDetailsQuery = useUsersDetailsQuery(nomineeQuery.data || []);
	const voteStatusQuery = useGetCurrentVoteStateQuery(walletAddress || '');

	useEffect(() => {
		if (periodData?.currentPeriod !== 'VOTING') push('/');
	}, [periodData, push]);

	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				{activeCouncil && <VoteBanner deployedModule={activeCouncil.module} />}
				<h1 className="tg-title-h1 text-center">
					{t('vote.nominees', { council: capitalizeString(activeCouncil.name) })}
				</h1>
				<div className="flex flex-wrap justify-center space-x-4 space-y-4">
					{usersDetailsQuery.isLoading || nomineeQuery.isLoading ? (
						<Loader />
					) : usersDetailsQuery.data?.length ? (
						usersDetailsQuery.data.map((member, index) => (
							<MemberCard
								key={member.address.concat(String(index).concat('voting'))}
								member={member}
								council={activeCouncil.name}
								deployedModule={activeCouncil.module}
								state="VOTING"
								votedFor={
									voteStatusQuery.data && voteStatusQuery.data[activeCouncil.name].candidate
								}
							/>
						))
					) : (
						<h4 className="tg-title-h4 text-center">{t('vote.no-nominations')}</h4>
					)}
				</div>
			</Main>
		</>
	);
}
