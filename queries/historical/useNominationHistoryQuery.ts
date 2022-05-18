import { useQuery } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';
import { ethers } from 'ethers';

/**
 * 	Query Nomination and Withdraw Nomination Events from Solidity Contracts
 *
 * 	event CandidateNominated(address indexed candidate, uint indexed epochIndex);
 *	event NominationWithdrawn(address indexed candidate, uint indexed epochIndex);
 *
 * @param {DeployedModules} moduleInstance The smart contract instance of the governance body to query
 * @param {string | null} candidate If needed, a specific wallets nomination history can be queried
 * @param {string | null} epochIndex If needed, we can select a specific epoch to query
 * @return {string[]} A list of addresses
 */
function useNominationHistoryQuery(
	moduleInstance: DeployedModules,
	candidate: string | null,
	epochIndex: string | null
) {
	const { governanceModules } = Modules.useContainer();
	return useQuery<string[]>(
		['nominationHistory', moduleInstance, candidate, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract as ethers.Contract;

			const nominationFilter = contract.filters.CandidateNominated(
				candidate ?? null,
				epochIndex ? ethers.BigNumber.from(epochIndex).toHexString() : null
			);
			const withdrawNominationFilter = contract.filters.NominationWithdrawn(
				candidate ?? null,
				epochIndex ? ethers.BigNumber.from(epochIndex).toHexString() : null
			);

			const nominationEvents = await contract.queryFilter(nominationFilter);
			const withdrawNominationEvents = await contract.queryFilter(withdrawNominationFilter);

			let candidates = [] as string[];

			nominationEvents.forEach((event: ethers.Event) => {
				candidates.push(event.args?.candidate);
			});

			withdrawNominationEvents.forEach((event: ethers.Event) => {
				if (candidates.includes(event.args?.candidate)) {
					candidates.splice(candidates.indexOf(event.args?.candidate), 1);
				}
			});

			return candidates;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useNominationHistoryQuery;
