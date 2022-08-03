import BackButton from 'components/BackButton';
import { CouncilCard } from 'components/CouncilCard';
import { useRouter } from 'next/router';
import useCurrentPeriod, { CurrentPeriodsWithCouncils } from 'queries/epochs/useCurrentPeriodQuery';
import { useTranslation } from 'react-i18next';
import { useConnectorContext } from 'containers/Connector';
import { useEffect, useState } from 'react';
import { useGetCurrentVoteStateQuery } from 'queries/voting/useGetCurrentVoteStateQuery';
import { VoteCard } from './VoteCard';
import { COUNCILS_DICTIONARY } from 'constants/config';

export default function VoteSection() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { walletAddress } = useConnectorContext();
	const [activeCouncilInVoting, setActiveCouncilInVoting] = useState<number | null>(null);
	const { data: allPeriods } = useCurrentPeriod();

	const voteStatusQuery = useGetCurrentVoteStateQuery(walletAddress || '');

	useEffect(() => {
		if (typeof activeCouncilInVoting === 'number' && activeCouncilInVoting === 0) push('/');
	}, [activeCouncilInVoting, push]);

	useEffect(() => {
		if (Array.isArray(allPeriods) && allPeriods.length) {
			setActiveCouncilInVoting(
				allPeriods.filter((period) => period[Object.keys(period)[0]] === 'VOTING').length
			);
		}
	}, [allPeriods]);

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
						{COUNCILS_DICTIONARY.map((council, index) => (
							<VoteCard
								key={council.slug.concat(index.toString())}
								walletAddress={voteStatusQuery.data?.spartan.candidateAddress}
								hasVoted={!!voteStatusQuery.data?.spartan.voted}
								periodIsVoting={
									!!(allPeriods as CurrentPeriodsWithCouncils[])?.find(
										(period) => period[council.slug] === 'VOTING'
									)
								}
								council={council.module}
							/>
						))}
					</div>
				</div>
			)}
			<div className="flex justify-center w-full flex-wrap mt-10 gap-2">
				{COUNCILS_DICTIONARY.map((council) => (
					<CouncilCard
						key={council.slug}
						deployedModule={council.module}
						council={council.slug}
						image={council.image}
					/>
				))}
			</div>
		</div>
	);
}
