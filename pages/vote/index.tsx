import { PlusIcon, ThreeDotsKebabIcon } from 'components/old-ui';
import Main from 'components/Main';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import VoteSection from 'components/Vote';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import { DeployedModules } from 'containers/Modules';
import { Card, IconButton } from '@synthetixio/ui';
import { useEffect, useState } from 'react';
import { useGetCurrentVoteStateQuery } from 'queries/voting/useGetCurrentVoteStateQuery';
import Avatar from 'components/Avatar';
import { truncateAddress } from 'utils/truncate-address';
import { COUNCIL_SLUGS, COUNCILS_DICTIONARY } from 'utils/config';
import { useModalContext } from 'containers/Modal';
import WithdrawVote from 'components/Modals/WithdrawVote';
import BackButton from 'components/BackButton';
import { PreEvaluationSection } from 'components/Vote/PreEvaluationSection';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { useAccount } from 'wagmi';

interface CouncilState {
	voted: boolean;
	candidate: undefined | GetUserDetails;
}

interface VoteState {
	spartan: CouncilState;
	grants: CouncilState;
	ambassador: CouncilState;
	treasury: CouncilState;
}

export default function Vote() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { data } = useAccount();
	const [userVoteHistory, setUserVoteHistory] = useState<VoteState>({
		spartan: { voted: false, candidate: undefined },
		grants: { voted: false, candidate: undefined },
		ambassador: { voted: false, candidate: undefined },
		treasury: { voted: false, candidate: undefined },
	});
	const [activeCouncilInVoting, setActiveCouncilInVoting] = useState<number | null>(null);
	const spartanQuery = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);
	const grantsQuery = useCurrentPeriod(DeployedModules.GRANTS_COUNCIL);
	const ambassadorQuery = useCurrentPeriod(DeployedModules.AMBASSADOR_COUNCIL);
	const treasuryQuery = useCurrentPeriod(DeployedModules.TREASURY_COUNCIL);
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

	const hasVotedAll =
		userVoteHistory.spartan.voted &&
		userVoteHistory.grants.voted &&
		userVoteHistory.ambassador.voted &&
		userVoteHistory.treasury.voted;
	useEffect(() => {
		if (voteStatusQuery.data) setUserVoteHistory(voteStatusQuery.data);
	}, [voteStatusQuery.data]);

	const calculateProgress = () => {
		let count = 0;
		for (const council of COUNCIL_SLUGS) {
			if (userVoteHistory[council as keyof VoteState].voted) count += 1;
		}
		return count;
	};

	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				<div className="flex flex-col items-center">
					{!!activeCouncilInVoting && (
						<Card variant="gray" wrapperClassName="flex flex-col max-w-[1300px] w-full">
							<h3 className="tg-title-h3 mb-2">
								{t(`vote.vote-status-${hasVotedAll ? 'complete' : 'incomplete'}`, {
									progress: calculateProgress(),
									max: activeCouncilInVoting,
								})}
							</h3>
							<div className="flex justify-between flex-wrap w-full">
								<VoteCard
									userDetail={userVoteHistory.spartan.candidate}
									hasVoted={userVoteHistory.spartan.voted}
									periodIsVoting={spartanQuery.data?.currentPeriod === 'VOTING'}
									council={DeployedModules.SPARTAN_COUNCIL}
								/>
								<VoteCard
									userDetail={userVoteHistory.grants.candidate}
									hasVoted={userVoteHistory.spartan.voted}
									council={DeployedModules.GRANTS_COUNCIL}
									periodIsVoting={grantsQuery.data?.currentPeriod === 'VOTING'}
								/>
								<VoteCard
									userDetail={userVoteHistory.ambassador.candidate}
									hasVoted={userVoteHistory.spartan.voted}
									council={DeployedModules.AMBASSADOR_COUNCIL}
									periodIsVoting={ambassadorQuery.data?.currentPeriod === 'VOTING'}
								/>
								<VoteCard
									userDetail={userVoteHistory.treasury.candidate}
									hasVoted={userVoteHistory.spartan.voted}
									council={DeployedModules.TREASURY_COUNCIL}
									periodIsVoting={treasuryQuery.data?.currentPeriod === 'VOTING'}
								/>
							</div>
						</Card>
					)}
					<BackButton />
					<VoteSection />
					<PreEvaluationSection />
				</div>
			</Main>
		</>
	);
}

const VoteCard = ({
	userDetail,
	hasVoted,
	council,
	periodIsVoting,
}: {
	userDetail?: Pick<GetUserDetails, 'address' | 'ens' | 'pfpThumbnailUrl'>;
	hasVoted: boolean;
	council: DeployedModules;
	periodIsVoting: boolean;
}) => {
	const { t } = useTranslation();
	const [isDropDownOpen, setIsDropDownOpen] = useState(false);
	const { setContent, setIsOpen } = useModalContext();
	const { push } = useRouter();
	if (!periodIsVoting)
		return (
			<h6 className="tg-title-h6">
				{t('vote.not-in-voting', { council: COUNCILS_DICTIONARY[council].label })}
			</h6>
		);

	return hasVoted && userDetail?.address ? (
		<div className="bg-black max-w-[250px] p-2 m-1 w-full rounded border-2 border-solid border-gray-900 flex items-center justify-between relative">
			<Avatar walletAddress={userDetail.address} width={33} height={33} />
			<div className="flex flex-col">
				<span className="tg-caption-bold text-primary">
					{t(`vote.councils.${COUNCILS_DICTIONARY[council].abbreviation}`)}
				</span>
				<span className="tg-content">{userDetail?.ens || truncateAddress(userDetail.address)}</span>
			</div>
			<IconButton rounded onClick={() => setIsDropDownOpen(!isDropDownOpen)} size="sm">
				<ThreeDotsKebabIcon active={isDropDownOpen} />
			</IconButton>
			{/* TODO @DEV add this dropdown to the UI lib */}
			{isDropDownOpen && (
				<div className="absolute top-[50px] right-0 bg-gray-900 rounded max-w-sm w-full flex flex-col">
					<span
						className="tg-caption p-2 text-primary cursor-pointer"
						onClick={() => push('/vote/' + COUNCILS_DICTIONARY[council].slug)}
					>
						{t('vote.dropdown.change')}
					</span>
					<span
						className="tg-caption p-2 text-primary bg-black cursor-pointer"
						onClick={() => {
							push('/profile/' + userDetail.address);
						}}
					>
						{t('vote.dropdown.view')}
					</span>
					<span
						className="tg-caption p-2 text-primary cursor-pointer"
						onClick={() => {
							setContent(
								<WithdrawVote
									council={COUNCILS_DICTIONARY[council].label}
									deployedModule={council}
									member={userDetail}
								/>
							);
							setIsOpen(true);
						}}
					>
						{t('vote.dropdown.uncast')}
					</span>
				</div>
			)}
		</div>
	) : (
		<div className="max-w-[250px] w-full bg-primary border-2 border-solid rounded border-primary ">
			<div className="darker-60 w-full h-full p-1 flex justify-between items-center">
				<div className="w-[33px] h-[33px] rounded-full border-primary border-2 border-solid bg-black"></div>
				<div className="flex flex-col">
					<span className="tg-caption-bold text-white">
						{t(`vote.councils.${COUNCILS_DICTIONARY[council].abbreviation}`)}
					</span>
					<span className="border-2 border-solid border-primary rounded p-1 text-primary tg-content-bold">
						{t('vote.not-voted')}
					</span>
				</div>
				<IconButton
					className="bg-black"
					size="sm"
					onClick={() => push('/vote/' + COUNCILS_DICTIONARY[council].slug)}
					rounded
				>
					<PlusIcon active />
				</IconButton>
			</div>
		</div>
	);
};
