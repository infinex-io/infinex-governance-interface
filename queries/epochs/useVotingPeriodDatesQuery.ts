import { useQuery } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';

type VotingPeriodDates = {
	votingPeriodStartDate: number;
	votingPeriodEndDate?: number;
};

function useVotingPeriodDatesQuery(moduleInstance: DeployedModules) {
	const { governanceModules } = Modules.useContainer();

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
