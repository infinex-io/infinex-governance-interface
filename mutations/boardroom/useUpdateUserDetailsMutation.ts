import { UPDATE_USER_DETAILS_API_URL } from 'constants/boardroom';
import Connector from 'containers/Connector';
import useIsUUIDValidQuery from 'queries/boardroom/useIsUUIDValidQuery';
import { useMutation } from 'react-query';

type UserDetails = {
	email: string;
	ens: string;
	username: string;
	twitter: string;
	about: string;
	website: string;
	notificationPreferences: string;
	associatedAddresses: string;
	pfpUrl: string;
	pfpImageId: string;
	pfpThumbnailUrl: string;
	bannerImageId: string;
	bannerUrl: string;
	bannerThumbnailUrl: string;
	type: string;
	uuid: string;
};

type UpdateUserDetailsResponse = {
	data: UserDetails;
};

function useUpdateUserDetailsMutation() {
	const { walletAddress, uuid, boardroomSignIn } = Connector.useContainer();
	const isUuidValidQuery = useIsUUIDValidQuery();

	return useMutation('updateUserDetails', async (userProfile: UserDetails) => {
		if (isUuidValidQuery.isSuccess && !isUuidValidQuery.data) {
			return await boardroomSignIn();
		} else {
			if (walletAddress) {
				const body = {
					email: '',
					ens: 'carlg.eth',
					username: 'Carl',
					twitter: '',
					about: 'Back end Developer',
					website: '',
					notificationPreferences: '',
					associatedAddresses: '',
					pfpUrl: '',
					pfpImageId: '',
					pfpThumbnailUrl: '',
					bannerImageId: '',
					bannerUrl: '',
					bannerThumbnailUrl: '',
					type: '',
					uuid: uuid,
				};
				let response = await fetch(UPDATE_USER_DETAILS_API_URL(walletAddress), {
					method: 'POST',
					body: JSON.stringify(body),
				});
				const { data } = (await response.json()) as UpdateUserDetailsResponse;
				return data;
			} else {
				return new Error();
			}
		}
	});
}

export default useUpdateUserDetailsMutation;
