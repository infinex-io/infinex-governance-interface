import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

function useCouncilTokenQuery(moduleInstance: DeployedModules) {
	const governanceModules = useModulesContext();

	return useQuery<string[]>(
		['councilToken', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let councilToken = await contract?.getCouncilToken();
			return councilToken;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useCouncilTokenQuery;
