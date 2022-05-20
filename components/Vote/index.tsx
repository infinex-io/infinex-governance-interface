import { CouncilCard } from 'components/CouncilCard';
import { useConnectorContext } from 'containers/Connector';
import { DeployedModules } from 'containers/Modules';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';
import useVoteHistoryQuery from 'queries/historical/useVoteHistoryQuery';
import { useTranslation } from 'react-i18next';
import { parseQuery } from 'utils/parse';

export default function VoteSection() {
	const { t } = useTranslation();
	const { walletAddress } = useConnectorContext();
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

	// Testing
	const { data: grantsEpochIndex } = useEpochIndexQuery(DeployedModules.GRANTS_COUNCIL);
	const voteQuery = useVoteHistoryQuery(
		DeployedModules.GRANTS_COUNCIL,
		walletAddress || '',
		null,
		String(grantsEpochIndex || 1)
	);

	return (
		<div className="flex flex-col items-center">
			<h1 className="tg-title-h1">{t('vote.headline')}</h1>
			<div className="flex justify-center flex-wrap space-x-8">
				{spartanCouncilInfo && (
					<CouncilCard
						{...spartanCouncilInfo}
						deployedModule={DeployedModules.SPARTAN_COUNCIL}
						image="/logos/spartan-council.svg"
						council="spartan"
					/>
				)}
				{grantsCouncilInfo && (
					<CouncilCard
						{...grantsCouncilInfo}
						deployedModule={DeployedModules.GRANTS_COUNCIL}
						image="/logos/grants-council.svg"
						council="grants"
					/>
				)}
				{ambassadorCouncilInfo && (
					<CouncilCard
						{...ambassadorCouncilInfo}
						deployedModule={DeployedModules.AMBASSADOR_COUNCIL}
						image="/logos/ambassador-council.svg"
						council="ambassador"
					/>
				)}
				{treasuryCouncilInfo && (
					<CouncilCard
						{...treasuryCouncilInfo}
						deployedModule={DeployedModules.TREASURY_COUNCIL}
						image="/logos/treasury-council.svg"
						council="treasury"
					/>
				)}
			</div>
		</div>
	);
}
