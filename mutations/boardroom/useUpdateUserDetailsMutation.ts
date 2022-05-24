import { UPDATE_USER_DETAILS_API_URL } from 'constants/boardroom';
import { useConnectorContext } from 'containers/Connector';
import useIsUUIDValidQuery from 'queries/boardroom/useIsUUIDValidQuery';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { useMutation, useQueryClient } from 'react-query';

type UpdateUserDetailsResponse = {
	data: GetUserDetails & {
		uuid: string;
	};
};

function useUpdateUserDetailsMutation() {
	const { walletAddress, uuid, boardroomSignIn } = useConnectorContext();
	const isUuidValidQuery = useIsUUIDValidQuery();
	const queryClient = useQueryClient();

	return useMutation(
		'updateUserDetails',
		async (userProfile: GetUserDetails) => {
			let signedInUuid = '';
			if (!isUuidValidQuery.data) {
				signedInUuid = (await boardroomSignIn()) || '';
			}
			if (walletAddress) {
				const body = {
					...userProfile,
					uuid: uuid || signedInUuid,
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
		},
		{
			onSuccess: async () => {
				await queryClient.refetchQueries(['userDetails']);
			},
		}
	);
}

export default useUpdateUserDetailsMutation;
