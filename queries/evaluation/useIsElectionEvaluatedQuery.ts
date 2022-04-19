import { useQuery } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';

function useIsElectionEvaluatedQuery(moduleInstance: DeployedModules) {
	const { governanceModules } = Modules.useContainer();

	return useQuery<boolean>(
		['isElectionEvaluated', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let isElectionEvaluated = await contract?.isElectionEvaluated();
			return isElectionEvaluated;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useIsElectionEvaluatedQuery;
