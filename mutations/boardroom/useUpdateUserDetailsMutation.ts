import { UPDATE_USER_DETAILS_API_URL } from 'constants/boardroom';
import { useConnectorContext } from 'containers/Connector';
import useIsUUIDValidQuery from 'queries/boardroom/useIsUUIDValidQuery';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { useMutation, useQueryClient } from 'react-query';
import { useAccount } from 'wagmi';

type UpdateUserDetailsResponse = {
	data: GetUserDetails & {
		uuid: string;
	};
};

function useUpdateUserDetailsMutation() {
	const { uuid, boardroomSignIn } = useConnectorContext();
	const { data } = useAccount();
	const isUuidValidQuery = useIsUUIDValidQuery();
	const queryClient = useQueryClient();
	const address = data?.address;
	return useMutation(
		'updateUserDetails',
		async (userProfile: GetUserDetails) => {
			let signedInUuid = '';
			if (!isUuidValidQuery.data) {
				signedInUuid = (await boardroomSignIn()) || '';
			}
			if (address) {
				const body = {
					...userProfile,
					uuid: signedInUuid || uuid,
				};
				let response = await fetch(UPDATE_USER_DETAILS_API_URL(address), {
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
