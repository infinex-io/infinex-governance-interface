import { DeployedModules, useModulesContext } from 'containers/Modules';
import { BigNumber, ethers } from 'ethers';
import { useQuery } from 'react-query';

export type BallotVotes = {
	ballotId: string;
	totalVotingPowerReceived: BigNumber;
	voters: string[];
	walletAddress: string;
	council: DeployedModules;
};

export const useVotingResult = (moduleInstance: DeployedModules, epochIndex: string | null) => {
	const governanceModules = useModulesContext();
	return useQuery<BallotVotes[]>(
		['voting-result', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract as ethers.Contract;

			console.log('useVotingResult!');
			// const addresses: string[] = await Promise.all(
			// 	result.map(vote =>
			// 		contract?.getBallotCandidatesInEpoch(vote.ballotId, hexStringBN(epochIndex))
			// 	)
			// );
			// return result.map((vote, index) => ({
			// 	...vote,
			// 	walletAddress: addresses[index],
			// 	council: moduleInstance,
			// }));
			return [];
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && epochIndex !== null,
			staleTime: 900000,
		}
	);
};
