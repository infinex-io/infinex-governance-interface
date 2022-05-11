import { GET_USER_DETAILS_API_URL } from 'constants/boardroom';
import { useQuery } from 'react-query';

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

function useUserDetailsQuery(walletAddress: string | string[]) {
	return useQuery<GetUserDetails | GetUserDetails[]>(
		['userDetails', walletAddress],
		async () => {
			if (Array.isArray(walletAddress)) {
				const promises = walletAddress.map((address) =>
					fetch(GET_USER_DETAILS_API_URL(address), {
						method: 'POST',
					})
				);
				const responses = await Promise.all(promises);
				const result = await Promise.all(responses.map((response) => response.json()));
				return result.map((r) => r.data);
			} else {
				let response = await fetch(GET_USER_DETAILS_API_URL(walletAddress), {
					method: 'POST',
				});
				const { data } = await response.json();
				return data;
			}
		},
		{
			enabled: walletAddress !== null,
			// 15 minutes
			cacheTime: 900000,
		}
	);
}

export default useUserDetailsQuery;
