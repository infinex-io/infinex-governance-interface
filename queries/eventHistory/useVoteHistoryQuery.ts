import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { BigNumber, Contract, ethers, Event } from 'ethers';
import { hexStringBN } from 'utils/hexString';

type VoteEvent = {
	voter: string;
	voterPower: BigNumber;
	ballotId: string;
	type?: string;
	totalVotes: BigNumber;
};

/**
 * 	Query Vote and Vote Withdrawn Events from Solidity Contracts
 *
 *	event VoteRecorded(address indexed voter, bytes32 indexed ballotId, uint indexed epochIndex, uint votePower);
 *	event VoteWithdrawn(address indexed voter, bytes32 indexed ballotId, uint indexed epochIndex, uint votePower);
 *
 * @param {DeployedModules} moduleInstance The smart contract instance of the governance body to query
 * @param {string | null} voter If needed, a specific wallets voting history can be queried
 * @param {string | null} ballotId If needed, we can query for a particular ballotId
 * @param {string | null} epochIndex If needed, we can query for a particular epoch
 * @return {string[]} A list of votes
 */

function useVoteHistoryQuery(
	moduleInstance: DeployedModules | null,
	voter: string | null,
	ballotId: string | null,
	epochIndex: string | null
) {
	const governanceModules = useModulesContext();
	return useQuery(
		['voteHistory', moduleInstance, voter, ballotId, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance!]?.contract as ethers.Contract;

			const votes = await voteHistory(contract, voter, ballotId, epochIndex);

			return votes;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
			staleTime: 900000,
		}
	);
}

export default useVoteHistoryQuery;

export async function voteHistory(
	contract: Contract,
	voter: string | null,
	ballotId: string | null,
	epochIndex: string | null
) {
	const voteFilter = contract.filters.VoteRecorded(
		voter ?? null,
		ballotId ?? null,
		epochIndex ? hexStringBN(epochIndex) : null
	);
	const voteWithdrawnFilter = contract.filters.VoteWithdrawn(
		voter ?? null,
		ballotId ?? null,
		epochIndex ? hexStringBN(epochIndex) : null
	);

	let voteEvents: Event[] = [];
	let voteWithdrawnEvents: Event[] = [];
	try {
		voteEvents = await contract.queryFilter(voteFilter);
	} catch (error) {}
	try {
		voteWithdrawnEvents = await contract.queryFilter(voteWithdrawnFilter);
	} catch (error) {}

	let combinedEvents = voteEvents
		.concat(voteWithdrawnEvents)
		.sort((a, b) => (a.blockNumber > b.blockNumber ? 1 : -1));

	let votes = [] as VoteEvent[];

	combinedEvents.forEach((event: Event) => {
		votes.push({
			voter: event.args?.voter,
			voterPower: event.args?.votePower,
			ballotId: event.args?.ballotId,
			type: event.event,
			totalVotes: BigNumber.from(0),
		});
	});

	let totalVotesForBallot: Record<string, { totalVotes: BigNumber }> = {};

	votes.forEach(vote => {
		if (!totalVotesForBallot[vote.ballotId]) {
			totalVotesForBallot[vote.ballotId] = {
				totalVotes: vote.voterPower,
			};
		} else {
			if (vote.type === 'VoteWithdrawn') {
				totalVotesForBallot[vote.ballotId] = {
					totalVotes: totalVotesForBallot[vote.ballotId].totalVotes.sub(vote.voterPower),
				};
			} else {
				totalVotesForBallot[vote.ballotId] = {
					totalVotes: totalVotesForBallot[vote.ballotId].totalVotes.add(vote.voterPower),
				};
			}
		}
	});

	return { totalVotesForBallot, votes };
}
