import { useQuery } from 'react-query';
import { DeployedModules, useModulesContext } from 'containers/Modules';
import useCouncilMembersQuery from './useCouncilMembersQuery';

function useGetMemberCouncilNameQuery(walletAddress: string) {
	const governanceModules = useModulesContext();

	const spartanQuery = useCouncilMembersQuery(DeployedModules.SPARTAN_COUNCIL);
	const grantsQuery = useCouncilMembersQuery(DeployedModules.GRANTS_COUNCIL);
	const ambassadorQuery = useCouncilMembersQuery(DeployedModules.AMBASSADOR_COUNCIL);
	const treasuryQuery = useCouncilMembersQuery(DeployedModules.TREASURY_COUNCIL);

	return useQuery<string>(
		['getMemberCouncilName', walletAddress],
		async () => {
			if (spartanQuery.data?.filter((member) => member === walletAddress).length) return 'Spartan';
			if (grantsQuery.data?.filter((member) => member === walletAddress).length) return 'Grants';
			if (ambassadorQuery.data?.filter((member) => member === walletAddress).length)
				return 'Ambassador';
			if (treasuryQuery.data?.filter((member) => member === walletAddress).length)
				return 'Treasury';
			return '';
		},
		{
			enabled: governanceModules !== null,
			// 15 minutes
			cacheTime: 900000,
		}
	);
}

export default useGetMemberCouncilNameQuery;
