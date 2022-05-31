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
	council?: string;
};

function useUserDetailsQuery(walletAddress: string) {
	return useQuery<GetUserDetails>(
		['userDetails', walletAddress],
		async () => {
			return await getUserDetails(walletAddress);
		},
		{
			enabled: walletAddress !== null,
			// 15 minutes
			cacheTime: 900000,
		}
	);
}

export default useUserDetailsQuery;

export async function getUserDetails(walletAddress: string) {
	let response = await fetch(GET_USER_DETAILS_API_URL(walletAddress), {
		method: 'POST',
	});
	const { data } = await response.json();
	return data;
}
