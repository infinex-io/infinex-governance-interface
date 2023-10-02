import { useQuery } from 'react-query';
import { DeployedModules, useModulesContext } from 'containers/Modules';
import useCouncilMembersQuery from './useCouncilMembersQuery';
import { compareAddress } from 'utils/helpers';

function useGetMemberCouncilNameQuery(walletAddress: string) {
	const governanceModules = useModulesContext();

	const tradeQuery = useCouncilMembersQuery(DeployedModules.TRADE_COUNCIL);
	const ecosystemQuery = useCouncilMembersQuery(DeployedModules.ECOSYSTEM_COUNCIL);
	const coreContributorQuery = useCouncilMembersQuery(DeployedModules.CORE_CONTRIBUTOR_COUNCIL);
	const treasuryQuery = useCouncilMembersQuery(DeployedModules.TREASURY_COUNCIL);

	return useQuery<string>(
		['getMemberCouncilName', walletAddress],
		async () => {
			if (tradeQuery.data?.filter((member) => compareAddress(member, walletAddress)).length)
				return 'Trade';
			if (ecosystemQuery.data?.filter((member) => compareAddress(member, walletAddress)).length)
				return 'Ecosystem';
			if (coreContributorQuery.data?.filter((member) => compareAddress(member, walletAddress)).length)
				return 'CoreContributor';
			if (treasuryQuery.data?.filter((member) => compareAddress(member, walletAddress)).length)
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
