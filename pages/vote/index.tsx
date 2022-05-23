import { ArrowLeftIcon, PlusIcon, ThreeDotsKebabIcon } from 'components/old-ui';
import Main from 'components/Main';
import { TextBold } from 'components/Text/bold';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import VoteBanner from 'components/Banners/VoteBanner';
import VoteSection from 'components/Vote';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import { DeployedModules } from 'containers/Modules';
import { Card, IconButton } from '@synthetixio/ui';
import { useEffect, useState } from 'react';
import { useConnectorContext } from 'containers/Connector';
import { useGetCurrentVoteStateQuery } from 'queries/voting/useGetCurrentVoteStateQuery';
import Avatar from 'components/Avatar';
import { GetUserDetails } from 'queries/members/useAllCouncilMembersQuery';
import { truncateAddress } from 'utils/truncate-address';
import { Councils } from 'utils/config';
import { useModalContext } from 'containers/Modal';
import VoteModal from 'components/Modals/Vote';
import WithdrawVote from 'components/Modals/WithdrawVote';

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
	const { walletAddress } = useConnectorContext();
	const [userVoteHistory, setUserVoteHistory] = useState<VoteState>({
		spartan: { voted: false, candidate: undefined },
		grants: { voted: false, candidate: undefined },
		ambassador: { voted: false, candidate: undefined },
		treasury: { voted: false, candidate: undefined },
	});
	const spartanQuery = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);
	const grantsQuery = useCurrentPeriod(DeployedModules.GRANTS_COUNCIL);
	const ambassadorQuery = useCurrentPeriod(DeployedModules.AMBASSADOR_COUNCIL);
	const treasuryQuery = useCurrentPeriod(DeployedModules.TREASURY_COUNCIL);
	const voteStatusQuery = useGetCurrentVoteStateQuery(walletAddress || '');

	// use that for getting the voted user
	// useBallotCandidatesQuery
	const oneCouncilIsInVotingPeriod =
		spartanQuery.data?.currentPeriod === 'VOTING' ||
		grantsQuery.data?.currentPeriod === 'VOTING' ||
		ambassadorQuery.data?.currentPeriod === 'VOTING' ||
		treasuryQuery.data?.currentPeriod === 'VOTING';

	useEffect(() => {
		if (voteStatusQuery.data) setUserVoteHistory(voteStatusQuery.data);
	}, [voteStatusQuery.data]);

	const calculateProgress = () => {
		let count = 0;
		for (const council of Councils) {
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
				{oneCouncilIsInVotingPeriod && <VoteBanner />}
				<div className="flex flex-col items-center">
					{!!oneCouncilIsInVotingPeriod && (
						<Card variant="gray" className="flex flex-col max-w-[1300px] w-full">
							<h3 className="tg-title-h3">
								{t(
									`vote.vote-status-${
										userVoteHistory.spartan.voted &&
										userVoteHistory.grants.voted &&
										userVoteHistory.ambassador.voted &&
										userVoteHistory.treasury.voted
											? 'complete'
											: 'incomplete'
									}`,
									{
										// TODO MF
										progress: calculateProgress(),
									}
								)}
							</h3>
							<div className="flex justify-between flex-wrap">
								{spartanQuery.data?.currentPeriod === 'VOTING' && (
									<VoteCard
										userDetail={userVoteHistory.spartan.candidate}
										hasVoted={userVoteHistory.spartan.voted}
										council="sc"
									/>
								)}
								{grantsQuery.data?.currentPeriod === 'VOTING' && (
									<VoteCard
										userDetail={userVoteHistory.grants.candidate}
										hasVoted={userVoteHistory.spartan.voted}
										council="gc"
									/>
								)}
								{ambassadorQuery.data?.currentPeriod === 'VOTING' && (
									<VoteCard
										userDetail={userVoteHistory.ambassador.candidate}
										hasVoted={userVoteHistory.spartan.voted}
										council="ac"
									/>
								)}
								{treasuryQuery.data?.currentPeriod === 'VOTING' && (
									<VoteCard
										userDetail={userVoteHistory.treasury.candidate}
										hasVoted={userVoteHistory.spartan.voted}
										council="tc"
									/>
								)}
							</div>
						</Card>
					)}
					<div className="flex items-center absolute top-[100px] left-[100px]">
						<IconButton onClick={() => push({ pathname: '/' })} rounded size="sm">
							<ArrowLeftIcon active />
						</IconButton>
						<TextBold color="lightBlue">{t('councils.back-btn')}</TextBold>
					</div>
					<VoteSection />
				</div>
			</Main>
		</>
	);
}

const VoteCard = ({
	userDetail,
	hasVoted,
	council,
}: {
	userDetail?: Pick<GetUserDetails, 'address' | 'ens'>;
	hasVoted: boolean;
	council: 'sc' | 'gc' | 'ac' | 'tc';
}) => {
	const { t } = useTranslation();
	const [isDropDownOpen, setIsDropDownOpen] = useState(false);
	const { setContent, setIsOpen } = useModalContext();
	const { push } = useRouter();
	const councilDic = {
		sc: { council: 'Spartan', module: DeployedModules.SPARTAN_COUNCIL },
		gc: { council: 'Grants', module: DeployedModules.GRANTS_COUNCIL },
		ac: { council: 'Ambassador', module: DeployedModules.AMBASSADOR_COUNCIL },
		tc: { council: 'Treasury', module: DeployedModules.TREASURY_COUNCIL },
	};
	return hasVoted && userDetail?.address ? (
		<div className="bg-black max-w-[270px] p-2 m-1 w-full rounded border-2 border-solid border-gray-900 flex items-center justify-between relative">
			<Avatar walletAddress={userDetail.address} width={33} height={33} />
			<div className="flex flex-col">
				<span className="tg-caption-bold text-primary">{t(`vote.councils.${council}`)}</span>
				<span className="tg-content">{userDetail?.ens || truncateAddress(userDetail.address)}</span>
			</div>
			<IconButton rounded onClick={() => setIsDropDownOpen(!isDropDownOpen)} size="sm">
				<ThreeDotsKebabIcon active={isDropDownOpen} />
			</IconButton>
			{isDropDownOpen && (
				<div className="absolute top-[50px] right-0 bg-gray-900 rounded max-w-sm w-full flex flex-col">
					<span
						className="tg-caption p-2 text-primary cursor-pointer"
						onClick={() => {
							push('/vote/' + councilDic[council].council.toLowerCase());
						}}
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
									address={userDetail.address}
									council={councilDic[council].council}
									deployedModule={councilDic[council].module}
									ens={userDetail.ens}
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
		<div className="max-w-[270px] w-full bg-primary border-2 border-solid rounded border-primary ">
			<div className="darker-60 w-full h-full p-1 flex justify-between items-center">
				<div className="w-[33px] h-[33px] rounded-full border-primary border-2 border-solid bg-black"></div>
				<div className="flex flex-col">
					<span className="tg-caption-bold text-white">{t(`vote.councils.${council}`)}</span>
					<span className="border-2 border-solid border-primary rounded p-1 text-primary tg-content-bold">
						{t('vote.not-voted')}
					</span>
				</div>
				<IconButton
					className="bg-black"
					size="sm"
					onClick={() => push('/vote/' + councilDic[council].council.toLowerCase())}
					rounded
				>
					<PlusIcon active />
				</IconButton>
			</div>
		</div>
	);
};
