import { GET_USER_DETAILS_API_URL } from 'constants/boardroom';
import { useConnectorContext } from 'containers/Connector';
import { useModulesContext } from 'containers/Modules';

import { useQuery } from 'react-query';
import { sortToOwnCard } from 'utils/sort';

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
	const { walletAddress } = useConnectorContext();

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
				spartan: spartanMembers.map((address: string) => users[address]),
				grants: grantsMembers.map((address: string) => users[address]),
				ambassador: ambassadorMembers.map((address: string) => users[address]),
				treasury: treasuryMembers.map((address: string) => users[address]),
			};
		},
		{
			enabled: governanceModules !== null,
			staleTime: 900000,
		}
	);
}

export default useAllCouncilMembersQuery;
