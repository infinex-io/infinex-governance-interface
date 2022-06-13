import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { CouncilsDictionaryType, COUNCILS_DICTIONARY } from 'constants/config';

export enum EpochPeriods {
	ADMINISTRATION = 0,
	NOMINATION = 1,
	VOTING = 2,
	EVALUATION = 3,
}

type CurrentPeriods = Record<CouncilsDictionaryType['slug'], keyof typeof EpochPeriods>;

function useAllCurrentPeriods() {
	const governanceModules = useModulesContext();

	return useQuery<CurrentPeriods[]>(
		['currentPeriods'],
		async () => {
			const promises = COUNCILS_DICTIONARY.map((council) =>
				governanceModules[council.module]?.contract.getCurrentPeriod()
			);
			const rawNumber = await Promise.all(promises);
			const results = rawNumber.map((raw) => Number(raw));
			return COUNCILS_DICTIONARY.map((council, index) => ({
				[council.slug]: EpochPeriods[results[index]] as keyof typeof EpochPeriods,
			}));
		},
		{
			enabled: governanceModules !== null,
			staleTime: 900000,
		}
	);
}

export default useAllCurrentPeriods;
