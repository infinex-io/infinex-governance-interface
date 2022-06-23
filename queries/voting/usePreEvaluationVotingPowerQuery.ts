import { DeployedModules, useModulesContext } from 'containers/Modules';
import { BigNumber, ethers } from 'ethers';
import useVoteHistoryQuery from 'queries/eventHistory/useVoteHistoryQuery';
import { useQuery } from 'react-query';
import { hexStringBN } from 'utils/hexString';

export type BallotVotes = {
	ballotId: string;
	totalVotingPowerReceived: BigNumber;
	voters: string[];
	walletAddress: string;
	council: DeployedModules;
};

export const usePreEvaluationVotingPowerQuery = (
	moduleInstance: DeployedModules,
	epochIndex: string
) => {
	const governanceModules = useModulesContext();
	const { data } = useVoteHistoryQuery(moduleInstance, null, null, epochIndex);
	return useQuery<BallotVotes[]>(
		['preEvaluationVotingPower', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract as ethers.Contract;
			var helper = {} as any;
			var result = data?.votes.reduce((group: any, currentData) => {
				var key = currentData.ballotId;

				if (!helper[key]) {
					helper[key] = Object.assign({}, currentData); // create a copy of currentData
					helper[key].voters = !helper[key].voters ? [currentData.voter] : [];
					helper[key].totalVotingPowerReceived =
						data.totalVotesForBallot[currentData.ballotId].totalVotes;
					delete helper[key].voter;
					delete helper[key].voterPower;
					group.push(helper[key]);
				} else {
					helper[key].totalVotingPowerReceived =
						data.totalVotesForBallot[currentData.ballotId].totalVotes;
					helper[key].voters.push(currentData.voter);
				}
				return group;
			}, []) as BallotVotes[];
			const addresses: string[] = await Promise.all(
				result.map(vote =>
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
			enabled:
				governanceModules !== null &&
				moduleInstance !== null &&
				epochIndex !== null &&
				data?.votes !== undefined,
			staleTime: 900000,
		}
	);
};
