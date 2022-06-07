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
			const spartanMembers = await governanceModules[
				'spartan council'
			]?.contract.getCouncilMembers();
			const grantsMembers = await governanceModules['grants council']?.contract.getCouncilMembers();
			const ambassadorMembers = await governanceModules[
				'ambassador council'
			]?.contract.getCouncilMembers();
			const treasuryMembers = await governanceModules[
				'treasury council'
			]?.contract.getCouncilMembers();

			const addresses = [
				...spartanMembers,
				...grantsMembers,
				...ambassadorMembers,
				...treasuryMembers,
			].filter((x, i, a) => a.indexOf(x) == i);

			const responses: Response[] = await Promise.all(
				addresses.map((address: string) =>
					fetch(GET_USER_DETAILS_API_URL(address), {
						method: 'POST',
					})
				)
			);
			const result = await Promise.all(responses.map((response) => response.json()));

			const users: { [key: string]: GetUserDetails } = {};

			addresses.forEach((address, index) => {
				users[address] = result[index].data;
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
