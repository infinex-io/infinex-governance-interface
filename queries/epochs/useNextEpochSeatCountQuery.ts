import { useQuery } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';

function useNextEpochSeatCountQuery(moduleInstance: DeployedModules) {
	const { governanceModules } = Modules.useContainer();

	return useQuery<number>(
		['nextEpochSeatCount', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let nextEpochSeatCount = Number(await contract?.getNextEpochSeatCount());
			return nextEpochSeatCount;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useNextEpochSeatCountQuery;
