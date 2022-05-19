import CouncilCard from 'components/CouncilCard';
import { H1 } from 'components/Headlines/H1';
import { useConnectorContext } from 'containers/Connector';
import { DeployedModules } from 'containers/Modules';
import useCurrentPeriod, { EpochPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';
import useVoteHistoryQuery from 'queries/historical/useVoteHistoryQuery';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useTranslation } from 'react-i18next';
import { parseIndex } from 'utils/parse';

export default function VoteSection() {
	const { t } = useTranslation();
	const { walletAddress } = useConnectorContext();
	const { data: spartanCurrentPeriod } = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);
	const { data: grantsCurrentPeriod } = useCurrentPeriod(DeployedModules.GRANTS_COUNCIL);
	const { data: ambassadorCurrentPeriod } = useCurrentPeriod(DeployedModules.AMBASSADOR_COUNCIL);
	const { data: treasuryCurrentPeriod } = useCurrentPeriod(DeployedModules.TREASURY_COUNCIL);
	const spartanNominees = useNomineesQuery(DeployedModules.SPARTAN_COUNCIL);
	const grantsNominees = useNomineesQuery(DeployedModules.GRANTS_COUNCIL);
	const ambassadorNominees = useNomineesQuery(DeployedModules.AMBASSADOR_COUNCIL);
	const treasuryNominees = useNomineesQuery(DeployedModules.TREASURY_COUNCIL);

	const spartanCouncilInfo =
		spartanCurrentPeriod?.currentPeriod === 'VOTING' &&
		parseIndex(EpochPeriods[spartanCurrentPeriod.currentPeriod]);
	const grantsCouncilInfo =
		grantsCurrentPeriod?.currentPeriod === 'VOTING' &&
		parseIndex(EpochPeriods[grantsCurrentPeriod.currentPeriod]);
	const ambassadorCouncilInfo =
		ambassadorCurrentPeriod?.currentPeriod === 'VOTING' &&
		parseIndex(EpochPeriods[ambassadorCurrentPeriod.currentPeriod]);
	const treasuryCouncilInfo =
		treasuryCurrentPeriod?.currentPeriod === 'VOTING' &&
		parseIndex(EpochPeriods[treasuryCurrentPeriod.currentPeriod]);
	const { data: grantsEpochIndex } = useEpochIndexQuery(DeployedModules.GRANTS_COUNCIL);
	const voteQuery = useVoteHistoryQuery(
		DeployedModules.GRANTS_COUNCIL,
		walletAddress || '',
		null,
		String(grantsEpochIndex || 1)
	);

	return (
		<div className="flex flex-col items-center">
			<H1>{t('vote.headline')}</H1>
			<div className="flex justify-center flex-wrap space-x-8">
				{spartanCouncilInfo && (
					<CouncilCard
						{...spartanCouncilInfo}
						nomineesCount={spartanNominees.data?.length}
						period={spartanCurrentPeriod?.currentPeriod}
						image="/logos/spartan-council.svg"
						council="spartan"
					/>
				)}
				{grantsCouncilInfo && (
					<CouncilCard
						{...grantsCouncilInfo}
						nomineesCount={grantsNominees.data?.length}
						period={grantsCurrentPeriod?.currentPeriod}
						image="/logos/grants-council.svg"
						council="grants"
					/>
				)}
				{ambassadorCouncilInfo && (
					<CouncilCard
						{...ambassadorCouncilInfo}
						nomineesCount={ambassadorNominees.data?.length}
						period={ambassadorCurrentPeriod?.currentPeriod}
						image="/logos/ambassador-council.svg"
						council="ambassador"
					/>
				)}
				{treasuryCouncilInfo && (
					<CouncilCard
						{...treasuryCouncilInfo}
						nomineesCount={treasuryNominees.data?.length}
						period={treasuryCurrentPeriod.currentPeriod}
						image="/logos/treasury-council.svg"
						council="treasury"
					/>
				)}
			</div>
		</div>
	);
}
