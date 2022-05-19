import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

function useBallotCandidatesQuery(moduleInstance: DeployedModules, ballotId: string) {
	const governanceModules = useModulesContext();

	return useQuery<string[]>(
		['ballotCandidates', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let ballotCandidates = await contract?.getBallotCandidates(ballotId);
			return ballotCandidates;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && ballotId !== null,
		}
	);
}

export default useBallotCandidatesQuery;
