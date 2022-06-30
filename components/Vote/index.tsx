import BackButton from 'components/BackButton';
import { CouncilCard } from 'components/CouncilCard';
import { DeployedModules } from 'containers/Modules';
import { useRouter } from 'next/router';

import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import { useTranslation } from 'react-i18next';
import { parseQuery } from 'utils/parse';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { useGetCurrentVoteStateQuery } from 'queries/voting/useGetCurrentVoteStateQuery';
import { VoteCard } from './VoteCard';

export default function VoteSection() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { data } = useAccount();
	const [activeCouncilInVoting, setActiveCouncilInVoting] = useState<number | null>(null);

	const spartanQuery = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);
	const grantsQuery = useCurrentPeriod(DeployedModules.GRANTS_COUNCIL);
	const ambassadorQuery = useCurrentPeriod(DeployedModules.AMBASSADOR_COUNCIL);
	const treasuryQuery = useCurrentPeriod(DeployedModules.TREASURY_COUNCIL);

	const spartanCouncilInfo =
		spartanQuery.data?.currentPeriod && parseQuery(spartanQuery.data.currentPeriod);
	const grantsCouncilInfo =
		grantsQuery.data?.currentPeriod && parseQuery(grantsQuery.data.currentPeriod);
	const ambassadorCouncilInfo =
		ambassadorQuery.data?.currentPeriod && parseQuery(ambassadorQuery.data.currentPeriod);
	const treasuryCouncilInfo =
		treasuryQuery.data?.currentPeriod && parseQuery(treasuryQuery.data.currentPeriod);

	const voteStatusQuery = useGetCurrentVoteStateQuery(data?.address || '');

	useEffect(() => {
		if (typeof activeCouncilInVoting === 'number' && activeCouncilInVoting === 0) push('/');
	}, [activeCouncilInVoting, push]);

	useEffect(() => {
		if (
			spartanQuery.data?.currentPeriod &&
			grantsQuery.data?.currentPeriod &&
			ambassadorQuery.data?.currentPeriod &&
			treasuryQuery.data?.currentPeriod
		) {
			setActiveCouncilInVoting(
				[
					spartanQuery.data?.currentPeriod,
					grantsQuery.data?.currentPeriod,
					ambassadorQuery.data?.currentPeriod,
					treasuryQuery.data?.currentPeriod,
				].filter((period) => period === 'VOTING').length
			);
		}
	}, [spartanQuery.data, grantsQuery.data, ambassadorQuery.data, treasuryQuery.data]);

	const count = [
		voteStatusQuery.data?.spartan.voted,
		voteStatusQuery.data?.grants.voted,
		voteStatusQuery.data?.ambassador.voted,
		voteStatusQuery.data?.treasury.voted,
	].filter((voted) => voted).length;

	const hasVotedAll =
		voteStatusQuery.data?.spartan.voted &&
		voteStatusQuery.data?.grants.voted &&
		voteStatusQuery.data?.ambassador.voted &&
		voteStatusQuery.data?.treasury.voted;

	return (
		<div className="flex flex-col items-center w-full container">
			<div className="relative w-full m-4 mt-8">
				<BackButton />
				<h1 className="tg-title-h1 text-center">{t('vote.headline')}</h1>
			</div>
			<span className="tg-body pb-8 text-center text-gray-500">{t('vote.subline')}</span>
			{!!activeCouncilInVoting && (
				<div className="max-w-[1000px] w-full p-4 rounded bg-dark-blue flex flex-wrap items-center">
					<div className="flex w-fit">
						<div className="pb-2 ml-2">
							<h3 className="md:tg-title-h3 tg-title-h4 pt-4">
								{t(`vote.vote-status-${hasVotedAll ? 'complete' : 'incomplete'}`, {
									progress: count,
									max: activeCouncilInVoting,
								})}
							</h3>
							<span className="tg-body text-gray-500">
								{t(count === 4 ? 'vote.vote-finished' : 'vote.vote-in-progress')}
							</span>
						</div>
					</div>
					<div className="flex justify-between flex-wrap w-full">
						<VoteCard
							walletAddress={voteStatusQuery.data?.spartan.candidateAddress}
							hasVoted={!!voteStatusQuery.data?.spartan.voted}
							periodIsVoting={spartanQuery.data?.currentPeriod === 'VOTING'}
							council={DeployedModules.SPARTAN_COUNCIL}
						/>
						<VoteCard
							walletAddress={voteStatusQuery.data?.grants.candidateAddress}
							hasVoted={!!voteStatusQuery.data?.grants.voted}
							council={DeployedModules.GRANTS_COUNCIL}
							periodIsVoting={grantsQuery.data?.currentPeriod === 'VOTING'}
						/>
						<VoteCard
							walletAddress={voteStatusQuery.data?.ambassador.candidateAddress}
							hasVoted={!!voteStatusQuery.data?.ambassador.voted}
							council={DeployedModules.AMBASSADOR_COUNCIL}
							periodIsVoting={ambassadorQuery.data?.currentPeriod === 'VOTING'}
						/>
						<VoteCard
							walletAddress={voteStatusQuery.data?.treasury.candidateAddress}
							hasVoted={!!voteStatusQuery.data?.treasury.voted}
							council={DeployedModules.TREASURY_COUNCIL}
							periodIsVoting={treasuryQuery.data?.currentPeriod === 'VOTING'}
						/>
					</div>
				</div>
			)}
			<div className="flex justify-center w-full flex-wrap mt-10 gap-2">
				{spartanCouncilInfo && (
					<CouncilCard
						deployedModule={DeployedModules.SPARTAN_COUNCIL}
						{...spartanCouncilInfo}
						image="/logos/spartan-council.svg"
						council="spartan"
					/>
				)}
				{grantsCouncilInfo && (
					<CouncilCard
						deployedModule={DeployedModules.GRANTS_COUNCIL}
						{...grantsCouncilInfo}
						image="/logos/grants-council.svg"
						council="grants"
					/>
				)}
				{ambassadorCouncilInfo && (
					<CouncilCard
						deployedModule={DeployedModules.AMBASSADOR_COUNCIL}
						{...ambassadorCouncilInfo}
						image="/logos/ambassador-council.svg"
						council="ambassador"
					/>
				)}
				{treasuryCouncilInfo && (
					<CouncilCard
						deployedModule={DeployedModules.TREASURY_COUNCIL}
						{...treasuryCouncilInfo}
						image="/logos/treasury-council.svg"
						council="treasury"
					/>
				)}
			</div>
		</div>
	);
}
