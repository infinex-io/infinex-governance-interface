import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { nomineesQueryKeys } from 'utils/queries';

function useNomineesQuery(moduleInstance: DeployedModules) {
	const governanceModules = useModulesContext();

	return useQuery<string[]>(
		nomineesQueryKeys(moduleInstance),
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			const nominees = await contract?.getNominees();

			return nominees;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
			staleTime: 900000,
		}
	);
}

export default useNomineesQuery;
