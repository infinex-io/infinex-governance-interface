import { GET_USER_DETAILS_API_URL } from 'constants/boardroom';
import Connector from 'containers/Connector';
import { useQuery } from 'react-query';

type UserDetails = {
	pfpUrl: string;
	website: string;
	pfpImageId: string;
	bannerThumbnailUrl: string;
	ens: string;
	address: string;
	twitter: string;
	bannerImageId: string;
	pfpThumbnailUrl: string;
	bannerUrl: string;
	username: string;
	type: string;
};

function useUserDetailsQuery() {
	const { walletAddress } = Connector.useContainer();
	return useQuery<UserDetails>(
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
