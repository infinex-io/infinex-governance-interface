import { useQuery } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';

function useNomineesQuery(moduleInstance: DeployedModules) {
	const { governanceModules } = Modules.useContainer();

	return useQuery<string[]>(
		['nominees', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let nominees = await contract?.getNominees();
			return nominees;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useNomineesQuery;
