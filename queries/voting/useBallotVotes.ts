import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

function useBallotVotesQuery(moduleInstance: DeployedModules, ballotId: string) {
	const governanceModules = useModulesContext();

	return useQuery<number>(
		['ballotVotes', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let ballotVotes = Number(await contract?.getBallotVotes(ballotId));
			return ballotVotes;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && ballotId !== null,
		}
	);
}

export default useBallotVotesQuery;
