import { useQuery } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';

function useBallotVotesQuery(moduleInstance: DeployedModules, ballotId: string) {
	const { governanceModules } = Modules.useContainer();

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
