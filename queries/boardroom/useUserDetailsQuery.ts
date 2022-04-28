import { GET_USER_DETAILS_API_URL } from 'constants/boardroom';
import Connector from 'containers/Connector';
import { useQuery } from 'react-query';

export type GetUserDetails = {
	// API currently returns address
	address?: string;
	//
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
};

function useUserDetailsQuery() {
	const { walletAddress } = Connector.useContainer();
	return useQuery<GetUserDetails>(
		['userDetails'],
		async () => {
			if (walletAddress) {
				let response = await fetch(GET_USER_DETAILS_API_URL(walletAddress), {
					method: 'POST',
				});
				const { data } = await response.json();
				return data;
			}
		},
		{
			enabled: walletAddress !== null,
		}
	);
}

export default useUserDetailsQuery;
