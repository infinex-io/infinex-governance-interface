import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { hexStringBN } from 'utils/hexString';

function useElectionWinnersQuery(moduleInstance: DeployedModules, epochIndex?: string) {
	const governanceModules = useModulesContext();

	return useQuery<string[]>(
		['electionWinners', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let electionWinners: string[];
			if (epochIndex) {
				electionWinners = await contract?.getElectionWinnersInEpoch(hexStringBN(epochIndex));
			} else {
				electionWinners = await contract?.getElectionWinners();
			}
			return electionWinners;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useElectionWinnersQuery;
