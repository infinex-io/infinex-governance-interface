import { DeployedModules, useModulesContext } from 'containers/Modules';
import { BigNumber, ethers } from 'ethers';
import client from 'gql/apollo-client';
import { useQuery } from 'react-query';
import { gql } from '@apollo/client';
import { hexStringBN } from 'utils/hexString';

export type VoteResult = {
	council: DeployedModules;
	epochIndex: string;
	ballotId: string;
	totalVotePower: BigNumber;
	voteCount: string;
	walletAddress: string;
};

export const useVotingResult = (
	moduleInstance: DeployedModules,
	epochIndex: string | number | null | undefined
) => {
	const governanceModules = useModulesContext();
	return useQuery<VoteResult[]>(
		['votingResult', moduleInstance, epochIndex],
		async () => {
			const contractAddress = governanceModules[moduleInstance]?.contract?.address?.toLowerCase();
			const epoch = String(epochIndex || '0');

			const { data } = await client.query({
				query: gql`
					query VoteResults {
						voteResults(
							where: { contract: "${contractAddress}", epochIndex: "${epoch}" }
						) {
							id
							epochIndex
							votePower
							contract
							voteCount
						}
					}
				`,
			});

			const contract = governanceModules[moduleInstance]?.contract as ethers.Contract;

			const voteResults = (data.voteResults || []).filter(
				(voteResult: any) => Number(voteResult.voteCount) > 0
			);
			const addresses: string[] = await Promise.all(
				voteResults.map((voteResult: any) =>
					contract?.getBallotCandidatesInEpoch(voteResult.id, hexStringBN(epoch))
				)
			);
			return voteResults
				.map((voteResult: any, index: number) => ({
					walletAddress: addresses[index].toString(),
					council: moduleInstance,
					ballotId: voteResult.id,
					totalVotePower: BigNumber.from(voteResult.votePower),
					voteCount: voteResult.voteCount,
					epochIndex: voteResult.epochIndex,
				}))
				.sort((a: any, b: any) => {
					if (a.totalVotePower.gt(b.totalVotePower)) return -1;
					if (a.totalVotePower.lt(b.totalVotePower)) return 1;
					return 0;
				});
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && epochIndex !== undefined,
			staleTime: 900000,
		}
	);
};
