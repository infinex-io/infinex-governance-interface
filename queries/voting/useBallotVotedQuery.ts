import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { hexStringBN } from 'utils/hexString';

function useBallotVotedQuery(
	moduleInstance: DeployedModules,
	walletAddress: string,
	epochIndex?: string
) {
	const governanceModules = useModulesContext();

	return useQuery<string>(
		['ballotVoted', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let ballotVoted: string;
			if (epochIndex) {
				ballotVoted = await contract?.getBallotVotedAtEpoch(walletAddress, hexStringBN(epochIndex));
			} else {
				ballotVoted = await contract?.getBallotVoted(walletAddress);
			}
			return ballotVoted;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && walletAddress !== null,
		}
	);
}

export default useBallotVotedQuery;
