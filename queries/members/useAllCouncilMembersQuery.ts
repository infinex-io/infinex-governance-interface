import { GET_USER_DETAILS_API_URL } from 'constants/boardroom';
import { useModulesContext } from 'containers/Modules';

import { useQuery } from 'react-query';

interface CouncilsUserData {
	spartan: GetUserDetails[];
	grants: GetUserDetails[];
	ambassador: GetUserDetails[];
	treasury: GetUserDetails[];
}

export type GetUserDetails = {
	address: string;
	email: string;
	ens: string;
	username: string;
	twitter: string;
	about: string;
	website: string;
	notificationPreferences: string;
	associatedAddresses: string;
	type: string;
	pfpUrl: string;
	pfpImageId: string;
	bannerThumbnailUrl: string;
	bannerImageId: string;
	pfpThumbnailUrl: string;
	bannerUrl: string;
	discord: string;
	delegationPitches: string;
	github: string;
};

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

			if (spartanMembers && grantsMembers && ambassadorMembers && treasuryMembers) {
				const spartanResponse: Response[] = await Promise.all(
					spartanMembers.map((address: string) =>
						fetch(GET_USER_DETAILS_API_URL(address), {
							method: 'POST',
						})
					)
				);
				const grantsResponse: Response[] = await Promise.all(
					grantsMembers.map((address: string) =>
						fetch(GET_USER_DETAILS_API_URL(address), {
							method: 'POST',
						})
					)
				);
				const ambassadorResponse: Response[] = await Promise.all(
					ambassadorMembers.map((address: string) =>
						fetch(GET_USER_DETAILS_API_URL(address), {
							method: 'POST',
						})
					)
				);
				const treasuryResponse: Response[] = await Promise.all(
					treasuryMembers.map((address: string) =>
						fetch(GET_USER_DETAILS_API_URL(address), {
							method: 'POST',
						})
					)
				);

				const result = await Promise.all([
					await Promise.all(spartanResponse.map((response) => response.json())),
					await Promise.all(grantsResponse.map((response) => response.json())),
					await Promise.all(ambassadorResponse.map((response) => response.json())),
					await Promise.all(treasuryResponse.map((response) => response.json())),
				]);

				return {
					spartan: result[0].map((r) => r.data),
					grants: result[1].map((r) => r.data),
					ambassador: result[2].map((r) => r.data),
					treasury: result[3].map((r) => r.data),
				};
			} else {
				return {
					spartan: [],
					grants: [],
					ambassador: [],
					treasury: [],
				};
			}
		},
		{
			enabled: governanceModules !== null,
			// 15 minutes
			cacheTime: 900000,
		}
	);
}

export default useAllCouncilMembersQuery;
