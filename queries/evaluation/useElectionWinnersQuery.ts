import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

function useElectionWinnersQuery(moduleInstance: DeployedModules) {
	const governanceModules = useModulesContext();

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
