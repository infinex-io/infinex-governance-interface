import { useQuery } from 'react-query';
import { DeployedModules } from 'containers/Modules';
import useIsNominated from './useIsNominatedQuery';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import { isNominatedForCouncilQueryKeys } from 'utils/queries';

function useIsNominatedForCouncilInNominationPeriod(walletAddress: string) {
	const spartan = useIsNominated(DeployedModules.SPARTAN_COUNCIL, walletAddress);
	const grants = useIsNominated(DeployedModules.GRANTS_COUNCIL, walletAddress);
	const ambassador = useIsNominated(DeployedModules.AMBASSADOR_COUNCIL, walletAddress);
	const treasury = useIsNominated(DeployedModules.TREASURY_COUNCIL, walletAddress);
	const spartanPeriod = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);
	const grantsPeriod = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);
	const ambassadorPeriod = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);
	const treasuryPeriod = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);

	return useQuery(
		isNominatedForCouncilQueryKeys(walletAddress),
		() => {
			const isNominatedFor = [
				{
					nominated: spartan.data,
					period: spartanPeriod.data?.currentPeriod,
					council: 'Spartan',
					module: DeployedModules.SPARTAN_COUNCIL,
				},
				{
					nominated: grants.data,
					period: grantsPeriod.data?.currentPeriod,
					council: 'Grants',
					module: DeployedModules.GRANTS_COUNCIL,
				},
				{
					nominated: ambassador.data,
					period: ambassadorPeriod.data?.currentPeriod,
					council: 'Ambassador',
					module: DeployedModules.AMBASSADOR_COUNCIL,
				},
				{
					nominated: treasury.data,
					period: treasuryPeriod.data?.currentPeriod,
					council: 'Treasury',
					module: DeployedModules.TREASURY_COUNCIL,
				},
			].filter((v) => v.nominated && v.period === 'NOMINATION');

			return isNominatedFor;
		},
		{
			enabled:
				walletAddress !== null &&
				typeof spartan.data === 'boolean' &&
				typeof grants.data === 'boolean' &&
				typeof ambassador.data === 'boolean' &&
				typeof treasury.data === 'boolean' &&
				!!spartanPeriod.data?.currentPeriod &&
				!!grantsPeriod.data?.currentPeriod &&
				!!ambassadorPeriod.data?.currentPeriod &&
				!!treasuryPeriod.data?.currentPeriod,
			staleTime: 900000,
		}
	);
}

export default useIsNominatedForCouncilInNominationPeriod;
