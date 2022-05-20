import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { hexStringBN } from 'utils/hexString';

function useHasVotedQuery(
	moduleInstance: DeployedModules,
	walletAddress: string,
	epochIndex?: string
) {
	const governanceModules = useModulesContext();

	return useQuery<boolean>(
		['hasVoted', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let hasVoted: boolean;
			if (epochIndex) {
				hasVoted = await contract?.hasVotedInEpoch(walletAddress, hexStringBN(epochIndex));
			} else {
				hasVoted = await contract?.hasVoted(walletAddress);
			}
			return hasVoted;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && walletAddress !== null,
		}
	);
}

export default useHasVotedQuery;
