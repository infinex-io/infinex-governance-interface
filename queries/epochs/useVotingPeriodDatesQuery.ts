import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

type VotingPeriodDates = {
	votingPeriodStartDate: number;
	votingPeriodEndDate?: number;
};

function useVotingPeriodDatesQuery(moduleInstance: DeployedModules) {
	const governanceModules = useModulesContext();

	return useQuery<VotingPeriodDates>(
		['votingPeriodDates', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let votingPeriodStartDate = Number(await contract?.getVotingPeriodStartDate()) * 1000;
			return { votingPeriodStartDate };
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useVotingPeriodDatesQuery;
