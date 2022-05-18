import { useQuery } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';
import { BigNumber, ethers } from 'ethers';

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
	moduleInstance: DeployedModules,
	voter: string | null,
	ballotId: string | null,
	epochIndex: string | null
) {
	const { governanceModules } = Modules.useContainer();
	return useQuery<VoteEvent[]>(
		['voteHistory', moduleInstance, voter, ballotId, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract as ethers.Contract;

			const voteFilter = contract.filters.VoteRecorded(
				voter ?? null,
				ballotId ?? null,
				epochIndex ? ethers.BigNumber.from(epochIndex).toHexString() : null
			);
			const voteWithdrawnFilter = contract.filters.VoteWithdrawn(
				voter ?? null,
				ballotId ?? null,
				epochIndex ? ethers.BigNumber.from(epochIndex).toHexString() : null
			);

			const voteEvents = await contract.queryFilter(voteFilter);
			const voteWithdrawnEvents = await contract.queryFilter(voteWithdrawnFilter);

			let listOfVoters = [] as string[];
			let votes = [] as VoteEvent[];

			voteEvents.forEach((event: ethers.Event) => {
				listOfVoters.push(event.args?.voter);
				votes.push({
					voter: event.args?.voter,
					voterPower: event.args?.votePower,
					ballotId: event.args?.ballotId,
				});
			});

			voteWithdrawnEvents.forEach((event: ethers.Event) => {
				if (listOfVoters.includes(event.args?.voter)) {
					votes.splice(listOfVoters.indexOf(event.args?.voter), 1);
				}
			});

			return votes;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useVoteHistoryQuery;
