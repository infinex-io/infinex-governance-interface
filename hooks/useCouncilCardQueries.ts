import { DeployedModules } from 'containers/Modules';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import useNominationPeriodDatesQuery from 'queries/epochs/useNominationPeriodDatesQuery';
import useVotingPeriodDatesQuery from 'queries/epochs/useVotingPeriodDatesQuery';
import useCouncilMembersQuery from 'queries/members/useCouncilMembersQuery';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';

export default function useCouncilCardQueries(deployedModule: DeployedModules) {
	const { data: votingDates } = useVotingPeriodDatesQuery(deployedModule);
	const { data: currentPeriodData } = useCurrentPeriod(deployedModule);
	const { data: nominationDates } = useNominationPeriodDatesQuery(deployedModule);
	const { data: nominees } = useNomineesQuery(deployedModule);
	const { data: councilMembers } = useCouncilMembersQuery(deployedModule);
	return {
		votingDates,
		currentPeriodData,
		nominationDates,
		nominees,
		councilMembers,
	};
}
