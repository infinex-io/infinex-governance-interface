import { useQuery } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';

function useBallotCandidatesQuery(moduleInstance: DeployedModules, ballotId: string) {
	const { governanceModules } = Modules.useContainer();

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
