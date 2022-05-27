import { useQuery } from 'react-query';
import { DeployedModules, useModulesContext } from 'containers/Modules';

function useEpochIndexQuery(moduleInstance: DeployedModules) {
	const governanceModules = useModulesContext();

	return useQuery<number>(
		['epochIndex', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let epochIndex = Number(await contract?.getEpochIndex());
			return epochIndex;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
			staleTime: 900000,
		}
	);
}

export default useEpochIndexQuery;
