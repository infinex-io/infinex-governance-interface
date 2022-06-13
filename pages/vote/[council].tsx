import VoteBanner from 'components/Banners/VoteBanner';
import { Loader } from 'components/Loader/Loader';
import Main from 'components/Main';
import MemberCard from 'components/MemberCard/Index';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useGetCurrentVoteStateQuery } from 'queries/voting/useGetCurrentVoteStateQuery';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from 'utils/capitalize';
import { parseQuery } from 'utils/parse';
import { useAccount } from 'wagmi';

export default function VoteCouncil() {
	const { query, push } = useRouter();
	const { t } = useTranslation();
	const activeCouncil = parseQuery(query?.council?.toString());
	const { data } = useAccount();
	const { data: periodData } = useCurrentPeriod(activeCouncil.module);
	const nomineeQuery = useNomineesQuery(activeCouncil.module);
	const voteStatusQuery = useGetCurrentVoteStateQuery(data?.address || '');

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
				<div className="flex flex-wrap justify-center p-3">
					{nomineeQuery.isLoading || nomineeQuery.isLoading ? (
						<Loader />
					) : nomineeQuery.data?.length ? (
						nomineeQuery.data.map((walletAddress, index) => (
							<MemberCard
								key={walletAddress.concat(String(index).concat('voting'))}
								walletAddress={walletAddress}
								council={activeCouncil.name}
								deployedModule={activeCouncil.module}
								state="VOTING"
								className="m-2"
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
