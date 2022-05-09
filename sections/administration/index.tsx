import ElectedCouncil from 'components/ElectedCouncil';
import LandingPage from 'components/LandingPage';
import { DeployedModules } from 'containers/Modules/Modules';
import useNominationPeriodDatesQuery from 'queries/epochs/useNominationPeriodDatesQuery';

export default function AdministrationLandingPage() {
	// TODO @DEV determine which number to show. Show the smallest one!
	const { data: spartanNextNomination } = useNominationPeriodDatesQuery(
		DeployedModules.SPARTAN_COUNCIL
	);
	const { data: ambassadorNextNomination } = useNominationPeriodDatesQuery(
		DeployedModules.AMBASSADOR_COUNCIL
	);
	const { data: treasuryNextNomination } = useNominationPeriodDatesQuery(
		DeployedModules.TREASURY_COUNCIL
	);
	const { data: grantsNextNomination } = useNominationPeriodDatesQuery(
		DeployedModules.GRANTS_COUNCIL
	);
	return (
		<>
			<LandingPage remainingTime={spartanNextNomination?.nominationPeriodStartDate} />
			<ElectedCouncil />
		</>
	);
}
