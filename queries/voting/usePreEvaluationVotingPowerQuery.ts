import { DeployedModules, useModulesContext } from 'containers/Modules';
import { BigNumber, ethers } from 'ethers';
import { voteHistory } from 'queries/eventHistory/useVoteHistoryQuery';
import { useQuery } from 'react-query';
import { hexStringBN } from 'utils/hexString';

type VoteList = Record<string, { totalVotingPower: BigNumber; candidates: string[] }>;

export const usePreEvaluationVotingPowerQuery = async (
	moduleInstance: DeployedModules,
	epochIndex: string
) => {
	const governanceModules = useModulesContext();

	return useQuery<VoteList>(
		['preEvaluationVotingPower', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract as ethers.Contract;
			const votes = await voteHistory(contract, null, null, epochIndex);

			const ballotList = {} as VoteList;

			votes.forEach(async ({ voterPower, ballotId }) => {
				ballotList[ballotId].totalVotingPower =
					ballotList[ballotId].totalVotingPower.add(voterPower);
				if (!ballotList[ballotId].candidates) {
					ballotList[ballotId].candidates = await contract?.getBallotCandidatesInEpoch(
						ballotId,
						hexStringBN(epochIndex)
					);
				}
			});

			return ballotList;
		},
		{
			enabled: moduleInstance !== null && epochIndex !== null,
		}
	);

	return;
};
