import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

function useGetElectionWinners(moduleInstance: DeployedModules, epochIndex: number) {
	const governanceModules = useModulesContext();

	return useQuery<string[]>(
		['electionWinners', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			const winners = await contract?.getElectionWinnersInEpoch(epochIndex);
			return winners;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
			staleTime: 900000,
		}
	);
}

export default useGetElectionWinners;
