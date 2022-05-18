import { useQuery } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';
import { ethers } from 'ethers';

type ElectionEvaluatedEvent = {
	epochIndex: string;
	totalBallots: string;
};

/**
 * 	Query Council for Election History
 *
 *  event ElectionEvaluated(uint indexed epochIndex, uint totalBallots);
 *
 * @param {DeployedModules} moduleInstance The smart contract instance of the governance body to query
 * @param {string | null} epochIndex If needed, we can select a specific epoch to query
 * @return {ElectionEvaluatedEvent[]} A list of ElectionEvaluatedEvent
 */
function useElectionHistoryQuery(moduleInstance: DeployedModules, epochIndex: string | null) {
	const { governanceModules } = Modules.useContainer();
	return useQuery<ElectionEvaluatedEvent[]>(
		['dismissalHistory', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract as ethers.Contract;

			const electionFilter = contract.filters.ElectionEvaluated(
				epochIndex ? ethers.BigNumber.from(epochIndex).toHexString() : null
			);
			const electionEvents = await contract.queryFilter(electionFilter);

			let previousElections = [] as ElectionEvaluatedEvent[];

			electionEvents.forEach((event: ethers.Event) => {
				previousElections.push({
					epochIndex: event.args?.epochIndex,
					totalBallots: event.args?.totalBallots,
				});
			});

			return previousElections;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useElectionHistoryQuery;
