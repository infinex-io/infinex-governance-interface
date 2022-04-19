import { useQuery } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';

function useCouncilTokenQuery(moduleInstance: DeployedModules) {
	const { governanceModules } = Modules.useContainer();

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
