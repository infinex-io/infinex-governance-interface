import { DeployedModules, useModulesContext } from 'containers/Modules';
import { useQuery } from 'react-query';

interface CouncilsAddresses {
	spartan: string[];
	grants: string[];
	ambassador: string[];
	treasury: string[];
}

export const useAllCouncilMembersAddresses = () => {
	const governanceModules = useModulesContext();

	return useQuery<CouncilsAddresses>(
		['council-members'],
		async () => {
			const [spartan, grants, ambassador, treasury] = await Promise.all([
				governanceModules[DeployedModules.SPARTAN_COUNCIL]?.contract.getCouncilMembers(),
				governanceModules[DeployedModules.GRANTS_COUNCIL]?.contract.getCouncilMembers(),
				governanceModules[DeployedModules.AMBASSADOR_COUNCIL]?.contract.getCouncilMembers(),
				governanceModules[DeployedModules.TREASURY_COUNCIL]?.contract.getCouncilMembers(),
			]);

			return {
				spartan,
				grants,
				ambassador,
				treasury,
			};
		},
		{
			enabled: !!governanceModules,
			staleTime: 900000,
		}
	);
};
