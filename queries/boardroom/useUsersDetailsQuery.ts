import { GET_USER_DETAILS_API_URL } from 'constants/boardroom';
import { useConnectorContext } from 'containers/Connector';
import { useQuery } from 'react-query';
import { sortToOwnCard } from 'utils/sort';

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

function useUsersDetailsQuery(walletAddresses: string[]) {
	const { walletAddress } = useConnectorContext();
	return useQuery<GetUserDetails[]>(
		['userDetails', walletAddresses.toString()],
		async () => {
			return await getUsersDetail(walletAddresses, walletAddress || '');
		},
		{
			enabled: walletAddresses !== null && walletAddresses.length > 0,
			// 15 minutes
			cacheTime: 900000,
		}
	);
}

export default useUsersDetailsQuery;

export async function getUsersDetail(walletAddresses: string[], ownAddress: string) {
	const promises = walletAddresses.map((address) =>
		fetch(GET_USER_DETAILS_API_URL(address), {
			method: 'POST',
		})
	);
	const responses = await Promise.all(promises);
	const result = await Promise.all(responses.map((response) => response.json()));
	if (ownAddress) {
		return sortToOwnCard(
			result.map((r) => r.data),
			ownAddress
		);
	}
	return result.map((r) => r.data);
}
