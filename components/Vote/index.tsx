import BackButton from 'components/BackButton';
import { CouncilCard } from 'components/CouncilCard';
import { DeployedModules } from 'containers/Modules';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import { useTranslation } from 'react-i18next';
import { parseQuery } from 'utils/parse';

export default function VoteSection() {
	const { t } = useTranslation();

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

	return (
		<div className="flex flex-col items-center w-full">
			<div className="relative w-full p-8">
				<BackButton />
				<h1 className="tg-title-h1 text-center">{t('vote.headline')}</h1>
			</div>
			<div className="flex justify-center flex-wrap space-x-8">
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
