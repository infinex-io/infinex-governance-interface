import { useQuery } from 'react-query';
import Modules, { DeployedModules } from 'containers/Modules/Modules';

function useEpochIndexQuery(moduleInstance: DeployedModules) {
	const { governanceModules } = Modules.useContainer();

	return useQuery<number>(
		['epochIndex', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let epochIndex = Number(await contract?.getEpochIndex());
			return epochIndex % 4;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useEpochIndexQuery;
