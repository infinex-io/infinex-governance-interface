import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

function useIsElectionEvaluatedQuery(moduleInstance: DeployedModules) {
	const governanceModules = useModulesContext();

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
