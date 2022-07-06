import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

export type EpochDates = {
	epochStartDate: number;
	epochEndDate: number;
};

function useGetElectionWinners(moduleInstance: DeployedModules, epochIndex: number) {
	const governanceModules = useModulesContext();

	return useQuery<EpochDates>(
		['election-winners', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			const data = await contract?.getElectionWinnersInEpoch(epochIndex);
			console.log('data', data, epochIndex);
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
			staleTime: 900000,
		}
	);
}

export default useGetElectionWinners;
