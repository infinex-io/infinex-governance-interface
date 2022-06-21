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
	return useQuery<VoteEvent[]>(
		['voteHistory', moduleInstance, voter, ballotId, epochIndex],
		async () => {
			if (moduleInstance) {
				const contract = governanceModules[moduleInstance]?.contract as ethers.Contract;

				const votes = await voteHistory(contract, voter, ballotId, epochIndex);

				return votes;
			}
			return [];
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
	voter = '0x585639fBf797c1258eBA8875c080Eb63C833d252';
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
		});
	});

	let totalVotesForBallot = {} as any;

	votes.forEach((vote) => {
		if (vote.type === 'VoteWithdrawn') {
			totalVotesForBallot[vote.ballotId] = totalVotesForBallot[vote.ballotId].sub(vote.voterPower);
		} else {
			totalVotesForBallot[vote.ballotId] = totalVotesForBallot[vote.ballotId].plus(vote.voterPower);
		}
	});

	return votes;
}
