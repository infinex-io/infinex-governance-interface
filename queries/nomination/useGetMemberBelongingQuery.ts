import { DeployedModules } from 'containers/Modules';
import { useQuery } from 'react-query';
import useIsNominated from './useIsNominatedQuery';

function useGetNomineeBelongingQuery(walletAddress: string) {
	const { data: isSpartanNominee } = useIsNominated(DeployedModules.SPARTAN_COUNCIL, walletAddress);
	const { data: isGrantsNominee } = useIsNominated(DeployedModules.GRANTS_COUNCIL, walletAddress);
	const { data: isAmbassadorNominee } = useIsNominated(
		DeployedModules.AMBASSADOR_COUNCIL,
		walletAddress
	);
	const { data: isTreasuryNominee } = useIsNominated(
		DeployedModules.TREASURY_COUNCIL,
		walletAddress
	);
	return useQuery<
		| {
				module: DeployedModules;
				name: 'Spartan' | 'Grants' | 'Ambassador' | 'Treasury';
		  }
		| undefined
	>(
		['useGetMemberBelonging', walletAddress],
		async () => {
			if (isSpartanNominee) return { module: DeployedModules.SPARTAN_COUNCIL, name: 'Spartan' };
			if (isGrantsNominee) return { module: DeployedModules.GRANTS_COUNCIL, name: 'Grants' };
			if (isAmbassadorNominee)
				return { module: DeployedModules.AMBASSADOR_COUNCIL, name: 'Ambassador' };
			if (isTreasuryNominee) return { module: DeployedModules.TREASURY_COUNCIL, name: 'Treasury' };
			return;
		},
		{
			enabled: true,
			staleTime: 900000,
		}
	);
}

export default useGetNomineeBelongingQuery;
