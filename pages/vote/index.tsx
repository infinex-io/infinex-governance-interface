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

export default function Vote() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const spartanQuery = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);
	const grantsQuery = useCurrentPeriod(DeployedModules.GRANTS_COUNCIL);
	const ambassadorQuery = useCurrentPeriod(DeployedModules.AMBASSADOR_COUNCIL);
	const treasuryQuery = useCurrentPeriod(DeployedModules.TREASURY_COUNCIL);

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
