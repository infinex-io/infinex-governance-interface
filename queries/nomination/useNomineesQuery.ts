import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

function useNomineesQuery(moduleInstance: DeployedModules) {
	const governanceModules = useModulesContext();

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
