import BackButton from 'components/BackButton';
import { CouncilCard } from 'components/CouncilCard';
import { DeployedModules } from 'containers/Modules';
import { useRouter } from 'next/router';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import { useTranslation } from 'react-i18next';
import { parseQuery } from 'utils/parse';
import { useAccount } from 'wagmi';
import { Badge, IconButton } from '@synthetixio/ui';
import { useEffect, useState } from 'react';
import { useGetCurrentVoteStateQuery } from 'queries/voting/useGetCurrentVoteStateQuery';
import Avatar from 'components/Avatar';
import { truncateAddress } from 'utils/truncate-address';
import { COUNCIL_SLUGS, COUNCILS_DICTIONARY } from 'constants/config';
import { useModalContext } from 'containers/Modal';
import WithdrawVote from 'components/Modals/WithdrawVote';
import { PlusIcon, ThreeDotsKebabIcon } from 'components/old-ui';
import Image from 'next/image';
import useIsMobile from 'hooks/useIsMobile';

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

export default function VoteSection() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { data } = useAccount();
	const { data: spartanCurrentPeriod } = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);
	const { data: grantsCurrentPeriod } = useCurrentPeriod(DeployedModules.GRANTS_COUNCIL);
	const { data: ambassadorCurrentPeriod } = useCurrentPeriod(DeployedModules.AMBASSADOR_COUNCIL);
	const { data: treasuryCurrentPeriod } = useCurrentPeriod(DeployedModules.TREASURY_COUNCIL);

	const spartanCouncilInfo =
		spartanCurrentPeriod?.currentPeriod && parseQuery(spartanCurrentPeriod.currentPeriod);
	const grantsCouncilInfo =
		grantsCurrentPeriod?.currentPeriod && parseQuery(grantsCurrentPeriod.currentPeriod);
	const ambassadorCouncilInfo =
		ambassadorCurrentPeriod?.currentPeriod && parseQuery(ambassadorCurrentPeriod.currentPeriod);
	const treasuryCouncilInfo =
		treasuryCurrentPeriod?.currentPeriod && parseQuery(treasuryCurrentPeriod.currentPeriod);

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
	const isMobile = useIsMobile();

	useEffect(() => {
		if (typeof activeCouncilInVoting === 'number' && activeCouncilInVoting === 0) push('/');
	}, [activeCouncilInVoting, push]);

	useEffect(() => {
		if (voteStatusQuery.data) setUserVoteHistory(voteStatusQuery.data);
	}, [voteStatusQuery.data]);

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

	const calculateProgress = () => {
		let count = 0;
		for (const council of COUNCIL_SLUGS) {
			if (userVoteHistory[council as keyof VoteState].voted) count += 1;
		}
		return count;
	};
	return (
		<div className="flex flex-col items-center w-full container">
			<div className="relative w-full m-4 mt-8">
				<BackButton />
				<h1 className="tg-title-h1 text-center">{t('vote.headline')}</h1>
			</div>
			<span className="tg-body pb-8 text-center">{t('vote.subline')}</span>
			{!!activeCouncilInVoting && (
				<div className="max-w-[1300px] w-full p-4 rounded bg-dark-blue flex flex-wrap items-center">
					<div className="flex w-fit">
						{!isMobile && (
							<Image
								src={`/images/${calculateProgress() === 4 ? 'tick' : 'pending-big'}.svg`}
								width={isMobile ? 40 : 90}
								height={isMobile ? 40 : 90}
							/>
						)}
						<div className="pb-2">
							<h3 className="md:tg-title-h3 tg-title-h4 pt-4">
								{t(`vote.vote-status-${hasVotedAll ? 'complete' : 'incomplete'}`, {
									progress: calculateProgress(),
									max: activeCouncilInVoting,
								})}
							</h3>
							<span className="tg-body text-gray-500">
								{t(calculateProgress() === 4 ? 'vote.vote-finished' : 'vote.vote-in-progress')}
							</span>
						</div>
					</div>
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
				</div>
			)}
			<div className="flex justify-center flex-wrap mt-10 gap-2">
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
	const activeCouncil =
		COUNCILS_DICTIONARY.find((c) => c.module === council) || COUNCILS_DICTIONARY[0];
	if (!periodIsVoting)
		return (
			<h6 className="tg-title-h6">{t('vote.not-in-voting', { council: activeCouncil.label })}</h6>
		);

	return hasVoted && userDetail?.address ? (
		<div className="bg-black max-w-[250px] p-2 m-1 w-full rounded border-2 border-solid border-gray-900 flex items-center justify-between relative">
			<Avatar walletAddress={userDetail.address} width={33} height={33} />
			<div className="flex flex-col">
				<span className="tg-caption-bold text-primary">
					{t(`vote.councils.${activeCouncil.abbreviation}`)}
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
						onClick={() => push('/vote/' + activeCouncil.slug)}
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
									council={activeCouncil.label}
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
		<div className="md:max-w-[250px] w-full bg-primary border-2 border-solid rounded border-primary my-2">
			<div className="darker-60 w-full h-full p-1 flex items-center rounded">
				<div className="w-[33px] h-[33px] rounded-full border-primary border-2 border-solid bg-black mr-2"></div>
				<div className="flex flex-col mr-auto">
					<span className="tg-caption-bold text-white">
						{t(`vote.councils.${activeCouncil.abbreviation}`)}
					</span>
					<Badge variant="blue" className="mt-1 uppercase w-fit">
						{t('vote.not-voted')}
					</Badge>
				</div>
				<IconButton
					className="bg-black"
					size="sm"
					onClick={() => push('/vote/' + activeCouncil.slug)}
					rounded
				>
					<PlusIcon active />
				</IconButton>
			</div>
		</div>
	);
};
