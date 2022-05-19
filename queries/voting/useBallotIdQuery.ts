import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

function useBallotIdQuery(moduleInstance: DeployedModules, candidates: string[]) {
	const governanceModules = useModulesContext();

	return useQuery<string>(
		['ballotId', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let ballotId = await contract?.calculateBallotId(candidates);
			return ballotId;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && candidates !== null,
		}
	);
}

export default useBallotIdQuery;
