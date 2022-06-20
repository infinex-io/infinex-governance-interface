import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { nomineesQueryKeys } from 'utils/queries';
import { shuffle } from 'utils/helpers';

function useNomineesQuery(moduleInstance: DeployedModules) {
	const governanceModules = useModulesContext();

	return useQuery<string[]>(
		nomineesQueryKeys(moduleInstance),
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			const nominees = await contract?.getNominees();

			return shuffle([...nominees]);
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
			staleTime: 900000,
		}
	);
}

export default useNomineesQuery;
