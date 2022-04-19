import { useQuery } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';

function useBallotVotedQuery(moduleInstance: DeployedModules, walletAddress: string) {
	const { governanceModules } = Modules.useContainer();

	return useQuery<string>(
		['ballotVoted', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let ballotVoted = await contract?.getBallotVoted(walletAddress);
			return ballotVoted;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && walletAddress !== null,
		}
	);
}

export default useBallotVotedQuery;
