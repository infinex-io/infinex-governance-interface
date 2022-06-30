import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { hexStringBN } from 'utils/hexString';
import { isNominatedQueryKeys } from 'utils/queries';
import { COUNCILS_DICTIONARY, COUNCIL_SLUGS } from 'constants/config';

export type NominationForCouncil = Record<string, boolean>;

function useIsNominated(
	moduleInstance: DeployedModules | null,
	walletAddress: string,
	epochIndex?: string
) {
	const governanceModules = useModulesContext();
	return useQuery<boolean | NominationForCouncil[]>(
		isNominatedQueryKeys(moduleInstance, walletAddress),
		async () => {
			if (!moduleInstance) {
				let promises;
				if (epochIndex) {
					promises = COUNCILS_DICTIONARY.map((council) =>
						governanceModules[council.module]?.contract.wasNominated(
							walletAddress,
							hexStringBN(epochIndex)
						)
					);
				} else {
					promises = COUNCILS_DICTIONARY.map((council) =>
						governanceModules[council.module]?.contract.isNominated(walletAddress)
					);
				}
				const results = await Promise.all(promises);
				return COUNCIL_SLUGS.map((council, index) => ({ [council]: results[index] }));
			} else {
				const contract = governanceModules[moduleInstance]?.contract;
				let isNominated: boolean;
				if (epochIndex) {
					isNominated = await contract?.wasNominated(walletAddress, hexStringBN(epochIndex));
				} else {
					isNominated = await contract?.isNominated(walletAddress);
				}
				return isNominated;
			}
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && walletAddress !== null,
			staleTime: 900000,
		}
	);
}

export default useIsNominated;
