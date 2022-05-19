import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

function useHasVotedQuery(moduleInstance: DeployedModules, walletAddress: string) {
	const governanceModules = useModulesContext();

	return useQuery<boolean>(
		['hasVoted', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let hasVoted = await contract?.hasVoted(walletAddress);
			return hasVoted;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && walletAddress !== null,
		}
	);
}

export default useHasVotedQuery;
