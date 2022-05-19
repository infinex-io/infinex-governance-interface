import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { ethers } from 'ethers';

type DismissalEvent = {
	epochIndex: string;
	members: string[];
};

/**
 * 	Query Council Dismissal Events
 *
 *  event CouncilMembersDismissed(address[] members, uint indexed epochIndex);
 *
 * @param {DeployedModules} moduleInstance The smart contract instance of the governance body to query
 * @param {string | null} epochIndex If needed, we can select a specific epoch to query
 * @return {DismissalEvent[]} A list of DismissalEvent
 */
function useDimissalHistoryQuery(moduleInstance: DeployedModules, epochIndex: string | null) {
	const governanceModules = useModulesContext();
	return useQuery<DismissalEvent[]>(
		['dismissalHistory', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract as ethers.Contract;

			const dismissalFilter = contract.filters.CouncilMembersDismissed(
				epochIndex ? ethers.BigNumber.from(epochIndex).toHexString() : null
			);
			const dismissalEvents = await contract.queryFilter(dismissalFilter);

			let dismissalsArray = [] as DismissalEvent[];

			dismissalEvents.forEach((event: ethers.Event) => {
				dismissalsArray.push({
					epochIndex: event.args?.epochIndex,
					members: event.args?.members,
				});
			});

			return dismissalsArray;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useDimissalHistoryQuery;
