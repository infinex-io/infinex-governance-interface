import { DeployedModules, useModulesContext } from 'containers/Modules';
import { BigNumber, ethers } from 'ethers';
import { voteHistory } from 'queries/eventHistory/useVoteHistoryQuery';
import { useQuery } from 'react-query';
import { hexStringBN } from 'utils/hexString';

export type BallotVotes = {
	ballotId: string;
	totalVotingPower: BigNumber;
	voters: string[];
	votingPowers: BigNumber[];
	walletAddress: string;
	council: DeployedModules;
};

export const usePreEvaluationVotingPowerQuery = (
	moduleInstance: DeployedModules,
	epochIndex: string
) => {
	const governanceModules = useModulesContext();

	return useQuery<BallotVotes[]>(
		['preEvaluationVotingPower', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract as ethers.Contract;

			const votes = await voteHistory(contract, null, null, epochIndex);

			var helper = {} as any;
			var result = votes.reduce((group: any, currentData) => {
				var key = currentData.ballotId;

				if (!helper[key]) {
					helper[key] = Object.assign({}, currentData); // create a copy of currentData
					helper[key].voters = !helper[key].voters ? [currentData.voter] : [];
					helper[key].votingPowers = !helper[key].votingPowers ? [currentData.voterPower] : [];
					helper[key].totalVotingPower = !helper[key].totalVotingPower
						? currentData.voterPower
						: BigNumber.from('0');
					delete helper[key].voter;
					delete helper[key].voterPower;
					group.push(helper[key]);
				} else {
					helper[key].totalVotingPower = helper[key].totalVotingPower.add(currentData.voterPower);
					helper[key].votingPowers.push(currentData.voterPower);
					helper[key].voters.push(currentData.voter);
				}
				return group;
			}, []) as BallotVotes[];
			const addresses: string[] = await Promise.all(
				result.map((vote) =>
					contract?.getBallotCandidatesInEpoch(vote.ballotId, hexStringBN(epochIndex))
				)
			);
			return result.map((vote, index) => ({
				...vote,
				walletAddress: addresses[index],
				council: moduleInstance,
			}));
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && epochIndex !== null,
			staleTime: 900000,
		}
	);
};
