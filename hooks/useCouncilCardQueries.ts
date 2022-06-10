import { DeployedModules } from 'containers/Modules';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';
import useNominationPeriodDatesQuery from 'queries/epochs/useNominationPeriodDatesQuery';
import useVoteHistoryQuery from 'queries/eventHistory/useVoteHistoryQuery';
import useCouncilMembersQuery from 'queries/members/useCouncilMembersQuery';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';

export default function useCouncilCardQueries(deployedModule: DeployedModules) {
	const currentEpochIndex = useEpochIndexQuery(deployedModule);
	/* const voteHistoryQuery = useVoteHistoryQuery(
		deployedModule,
		null,
		null,
		String(currentEpochIndex.data)
	); */
	const { data: currentPeriodData } = useCurrentPeriod(deployedModule);
	const { data: nominationDates } = useNominationPeriodDatesQuery(deployedModule);
	const { data: nominees } = useNomineesQuery(deployedModule);
	const { data: councilMembers } = useCouncilMembersQuery(deployedModule);
	return {
		currentEpochIndex,
		currentPeriodData,
		nominationDates,
		nominees,
		councilMembers,
	};
}
