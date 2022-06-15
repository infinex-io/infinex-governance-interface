import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { BigNumber, Contract, ethers, Event } from 'ethers';
import { hexStringBN } from 'utils/hexString';

type VoteEvent = {
	voter: string;
	voterPower: BigNumber;
	ballotId: string;
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
	} catch (error) {
		console.log('no voting events found for voter: ', voter);
	}
	try {
		voteWithdrawnEvents = await contract.queryFilter(voteWithdrawnFilter);
	} catch (error) {
		console.log('no withdraw voting events found for voter: ', voter);
	}
	let listOfVoters = [] as string[];
	let votes = [] as VoteEvent[];
	voteEvents.forEach((event: Event) => {
		listOfVoters.push(event.args?.voter);
		votes.push({
			voter: event.args?.voter,
			voterPower: event.args?.votePower,
			ballotId: event.args?.ballotId,
		});
	});

	voteWithdrawnEvents.forEach((event: Event) => {
		if (listOfVoters.includes(event.args?.voter)) {
			votes.splice(listOfVoters.indexOf(event.args?.voter), 1);
		}
	});

	return votes;
}
