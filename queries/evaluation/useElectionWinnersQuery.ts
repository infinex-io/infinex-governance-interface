import { useQuery } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';

function useElectionWinnersQuery(moduleInstance: DeployedModules) {
	const { governanceModules } = Modules.useContainer();

	return useQuery<string[]>(
		['electionWinners', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let electionWinners = await contract?.getElectionWinners();
			return electionWinners;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useElectionWinnersQuery;
