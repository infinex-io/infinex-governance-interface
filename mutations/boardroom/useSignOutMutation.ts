import { BOARDROOM_SIGNOUT_API_URL } from 'constants/boardroom';
import Connector from 'containers/Connector';
import { useMutation } from 'react-query';

type SignOutResponse = {
	data: {
		success: boolean;
	};
};

function useSignOutMutation() {
	const { walletAddress, uuid } = Connector.useContainer();
	return useMutation('signMessageMutation', async () => {
		if (walletAddress && uuid) {
			const body = {
				address: walletAddress,
				uuid: uuid,
			};
			let response = await fetch(BOARDROOM_SIGNOUT_API_URL, {
				method: 'POST',
				body: JSON.stringify(body),
			});

			const { data }: SignOutResponse = await response.json();

			return data.success;
		} else {
			return new Error();
		}
	});
}

export default useSignOutMutation;
