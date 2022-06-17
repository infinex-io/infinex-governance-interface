import { GET_USER_DETAILS_API_URL } from 'constants/boardroom';
import { useModulesContext } from 'containers/Modules';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';

import { useQuery } from 'react-query';

interface CouncilsUserData {
	spartan: GetUserDetails[];
	grants: GetUserDetails[];
	ambassador: GetUserDetails[];
	treasury: GetUserDetails[];
}

function useAllCouncilMembersQuery() {
	const governanceModules = useModulesContext();
	return useQuery<CouncilsUserData>(
		['allCouncilMembers'],
		async () => {
			const spartanMembersPromise =
				governanceModules['spartan council']?.contract.getCouncilMembers();
			const grantsMembersPromise =
				governanceModules['grants council']?.contract.getCouncilMembers();
			const ambassadorMembersPromise =
				governanceModules['ambassador council']?.contract.getCouncilMembers();
			const treasuryMembersPromise =
				governanceModules['treasury council']?.contract.getCouncilMembers();
			const [spartanMembers, grantsMembers, ambassadorMembers, treasuryMembers]: string[][] =
				await Promise.all([
					spartanMembersPromise,
					grantsMembersPromise,
					ambassadorMembersPromise,
					treasuryMembersPromise,
				]);
			const addresses = [
				...spartanMembers,
				...grantsMembers,
				...ambassadorMembers,
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
				spartan: spartanMembers.map((address: string) => ({
					...users[address],
					council: 'spartan',
				})),
				grants: grantsMembers.map((address: string) => ({ ...users[address], council: 'grants' })),
				ambassador: ambassadorMembers.map((address: string) => ({
					...users[address],
					council: 'ambassador',
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
