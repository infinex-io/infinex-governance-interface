import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

function useNextEpochSeatCountQuery(moduleInstance: DeployedModules) {
	const governanceModules = useModulesContext();

	return useQuery<number>(
		['nextEpochSeatCount', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let nextEpochSeatCount = Number(await contract?.getNextEpochSeatCount());
			return nextEpochSeatCount;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
			staleTime: 900000,
		}
	);
}

export default useNextEpochSeatCountQuery;
