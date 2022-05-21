import { ArrowLeftIcon, IconButton } from 'components/old-ui';
import Main from 'components/Main';
import { TextBold } from 'components/Text/bold';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import VoteBanner from 'components/Banners/VoteBanner';
import VoteSection from 'components/Vote';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import { DeployedModules } from 'containers/Modules';
import { Card } from '@synthetixio/ui';
import { useState } from 'react';
import { useConnectorContext } from 'containers/Connector';
import { useGetCurrentVoteStateQuery } from 'queries/voting/useGetCurrentVoteStateQuery';

export default function Vote() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { walletAddress } = useConnectorContext();
	const [userVoteHistory, setUserVoteHistory] = useState({
		spartan: { voted: false, candidate: null },
		grants: { voted: false, candidate: null },
		ambassador: { voted: false, candidate: null },
		treasury: { voted: false, candidate: null },
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

	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				{oneCouncilIsInVotingPeriod && <VoteBanner />}
				<div className="flex flex-col items-center">
					{!!oneCouncilIsInVotingPeriod && (
						<Card variant="gray" className="flex flex-col">
							<h3 className="tg-title-h3">
								{t(
									`vote.vote-status-${
										userVoteHistory.spartan &&
										userVoteHistory.grants &&
										userVoteHistory.ambassador &&
										userVoteHistory.treasury
											? 'complete'
											: 'incomplete'
									}`,
									{
										// TODO MF
										progress: 1,
									}
								)}
							</h3>
							<div className="flex justify-between">
								<div className="bg-black">
									<h5 className="tg-title-h5">Spartan Councils</h5>
								</div>
								<div className="bg-black">
									<h5 className="tg-title-h5">Grants Councils</h5>
								</div>
								<div className="bg-black">
									<h5 className="tg-title-h5">Ambassador Councils</h5>
								</div>
								<div className="bg-black">
									<h5 className="tg-title-h5">Treasury Councils</h5>
								</div>
							</div>
						</Card>
					)}
					<div className="flex items-center absolute top-[100px] left-[100px]">
						<IconButton active onClick={() => push({ pathname: '/' })} rounded size="tiniest">
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
