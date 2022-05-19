import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { hexStringBN } from 'utils/hexString';

type VotingPeriodDates = {
	votingPeriodStartDate: number;
	votingPeriodEndDate: number;
};

function useVotingPeriodDatesQuery(moduleInstance: DeployedModules, epochIndex?: string) {
	const governanceModules = useModulesContext();

	return useQuery<VotingPeriodDates>(
		['votingPeriodDates', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let votingPeriodStartDate;
			let votingPeriodEndDate;

			if (epochIndex) {
				votingPeriodStartDate =
					Number(await contract?.getVotingPeriodStartDateForIndex(hexStringBN(epochIndex))) * 1000;
				votingPeriodEndDate =
					Number(await contract?.getEpochEndDateForIndex(hexStringBN(epochIndex))) * 1000;
			} else {
				votingPeriodStartDate = Number(await contract?.getVotingPeriodStartDate()) * 1000;
				votingPeriodEndDate = Number(await contract?.getEpochEndDate()) * 1000;
			}

			return { votingPeriodStartDate, votingPeriodEndDate };
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useVotingPeriodDatesQuery;
