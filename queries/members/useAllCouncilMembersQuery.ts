import { GET_USER_DETAILS_API_URL } from 'constants/boardroom';
import { useModulesContext } from 'containers/Modules';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { DeployedModules } from 'containers/Modules';

import { useQuery } from 'react-query';

interface CouncilsUserData {
	trade: GetUserDetails[];
	ecosystem: GetUserDetails[];
	coreContributor: GetUserDetails[];
	treasury: GetUserDetails[];
}

function useAllCouncilMembersQuery() {
	const governanceModules = useModulesContext();
	return useQuery<CouncilsUserData>(
		['allCouncilMembers'],
		async () => {
			const tradeMembersPromise =
				governanceModules[DeployedModules.TRADE_COUNCIL]?.contract.getCouncilMembers();
			const ecosystemMembersPromise =
				governanceModules[DeployedModules.ECOSYSTEM_COUNCIL]?.contract.getCouncilMembers();
			const coreContributorMembersPromise =
				governanceModules[DeployedModules.CORE_CONTRIBUTORS_COUNCIL]?.contract.getCouncilMembers();
			const treasuryMembersPromise =
				governanceModules[DeployedModules.TREASURY_COUNCIL]?.contract.getCouncilMembers();
			const [tradeMembers, ecosystemMembers, coreContributorMembers, treasuryMembers]: string[][] =
				await Promise.all([
					tradeMembersPromise,
					ecosystemMembersPromise,
					coreContributorMembersPromise,
					treasuryMembersPromise,
				]);
			const addresses = [
				...tradeMembers,
				...ecosystemMembers,
				...coreContributorMembers,
				...treasuryMembers,
			].filter((x, i, a) => a.indexOf(x) == i);

			const userDetails: { data: GetUserDetails }[] = await Promise.all(
				addresses.map(async (address: string) => {
					const response = await fetch(GET_USER_DETAILS_API_URL(address), {
						method: 'POST',
					});
					return response.json();
				})
			);
			const users: { [key: string]: GetUserDetails } = {};

			addresses.forEach((address, index) => {
				users[address] = userDetails[index].data;
			});

			return {
				trade: tradeMembers.map((address: string) => ({
					...users[address],
					council: 'trade',
				})),
				ecosystem: ecosystemMembers.map((address: string) => ({ ...users[address], council: 'ecosystem' })),
				coreContributor: coreContributorMembers.map((address: string) => ({
					...users[address],
					council: 'coreContributor',
				})),
				treasury: treasuryMembers.map((address: string) => ({
					...users[address],
					council: 'treasury',
				})),
			};
		},
		{
			enabled: governanceModules !== null,
			staleTime: 900000,
		}
	);
}

export default useAllCouncilMembersQuery;
