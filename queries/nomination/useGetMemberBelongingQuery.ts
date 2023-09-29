import { DeployedModules } from 'containers/Modules';
import { useQuery } from 'react-query';
import useIsNominated from './useIsNominatedQuery';

function useGetNomineeBelongingQuery(walletAddress: string) {
	const { data: isTradeNominee } = useIsNominated(DeployedModules.TRADE_COUNCIL, walletAddress);
	const { data: isEcosystemNominee } = useIsNominated(DeployedModules.ECOSYSTEM_COUNCIL, walletAddress);
	const { data: isCoreContributorNominee } = useIsNominated(
		DeployedModules.CORE_CONTRIBUTORS_COUNCIL,
		walletAddress
	);
	const { data: isTreasuryNominee } = useIsNominated(
		DeployedModules.TREASURY_COUNCIL,
		walletAddress
	);
	return useQuery<
		| {
				module: DeployedModules;
				name: 'Trade' | 'Ecosystem' | 'CoreContributor' | 'Treasury';
		  }
		| undefined
	>(
		['useGetMemberBelonging', walletAddress],
		async () => {
			if (isTradeNominee) return { module: DeployedModules.TRADE_COUNCIL, name: 'Trade' };
			if (isEcosystemNominee) return { module: DeployedModules.ECOSYSTEM_COUNCIL, name: 'Ecosystem' };
			if (isCoreContributorNominee)
				return { module: DeployedModules.CORE_CONTRIBUTORS_COUNCIL, name: 'CoreContributor' };
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
