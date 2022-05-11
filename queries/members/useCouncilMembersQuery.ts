import { useQuery } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';

function useCouncilMembersQuery(moduleInstance: DeployedModules) {
	const { governanceModules } = Modules.useContainer();

	return useQuery<string[]>(
		['councilMembers', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let councilMembers = await contract?.getCouncilMembers();
			return councilMembers;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
			// 15 minutes
			cacheTime: 900000,
		}
	);
}

export default useCouncilMembersQuery;
