import { UPDATE_USER_DETAILS_API_URL } from 'constants/boardroom';
import Connector from 'containers/Connector';
import useIsUUIDValidQuery from 'queries/boardroom/useIsUUIDValidQuery';
import { useMutation } from 'react-query';

type UpdateUserDetailsResponse = {
	data: {
		success: boolean;
	};
};

function useUpdateUserMutation() {
	const { walletAddress, uuid, setUuid, boardroomSignIn } = Connector.useContainer();
	const isUuidValidQuery = useIsUUIDValidQuery();

	return useMutation('updateUserDetails', async () => {
		if (isUuidValidQuery.isSuccess && !isUuidValidQuery.data) {
			return await boardroomSignIn();
		} else {
			if (walletAddress) {
				// @TODO
				return;
			} else {
				return new Error();
			}
		}
	});
}

export default useUpdateUserMutation;
