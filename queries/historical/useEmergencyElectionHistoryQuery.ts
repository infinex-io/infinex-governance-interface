import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { ethers } from 'ethers';

type EmergencyElectionEvent = {
	epochIndex: string;
};

/**
 * 	Query Council for Emergency Election History
 *
 *  event EmergencyElectionStarted(uint indexed epochIndex);
 *
 * @param {DeployedModules} moduleInstance The smart contract instance of the governance body to query
 * @param {string | null} epochIndex If needed, we can select a specific epoch to query
 * @return {EmergencyElectionEvent[]} A list of EmergencyElectionEvent
 */
function useEmergencyElectionHistoryQuery(
	moduleInstance: DeployedModules,
	epochIndex: string | null
) {
	const governanceModules = useModulesContext();
	return useQuery<EmergencyElectionEvent[]>(
		['dismissalHistory', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract as ethers.Contract;

			const emergencyElectionFilter = contract.filters.EmergencyElectionStarted(
				epochIndex ? ethers.BigNumber.from(epochIndex).toHexString() : null
			);
			const emergencyElectionEvents = await contract.queryFilter(emergencyElectionFilter);

			let previousEmergencyElections = [] as EmergencyElectionEvent[];

			emergencyElectionEvents.forEach((event: ethers.Event) => {
				previousEmergencyElections.push({
					epochIndex: event.args?.epochIndex,
				});
			});

			return previousEmergencyElections;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useEmergencyElectionHistoryQuery;
