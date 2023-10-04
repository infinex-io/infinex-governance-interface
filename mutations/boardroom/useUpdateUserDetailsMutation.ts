import {
	BOARDROOM_SIGNIN_API_URL,
	NONCE_API_URL,
	UPDATE_USER_DETAILS_API_URL,
	UPDATE_USER_PITCH_FOR_PROTOCOL,
} from 'constants/boardroom';
import { useConnectorContext } from 'containers/Connector';
import useIsUUIDValidQuery from 'queries/boardroom/useIsUUIDValidQuery';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { SiweMessage } from 'siwe';
import { NETWORK_ID } from '../../utils/network';

type UpdateUserDetailsResponse = {
	data: GetUserDetails & {
		uuid: string;
	};
};
type SIWEMessage = {
	message: {
		domain: string;
		address: string;
		chainId: number;
		uri: string;
		version: string;
		statement: string;
		nonce: string;
		issuedAt: string;
		signature: string;
	};
};

type NonceResponse = {
	data: {
		nonce: string;
	};
};

type SignInResponse = {
	data: {
		ens: string;
		address: string;
		uuid: string;
	};
};

function useUpdateUserDetailsMutation() {
	const { walletAddress, provider, signer } = useConnectorContext();
	const [uuid, setUuid] = useState<null | string>(null);
	const boardroomSignIn = async () => {
		const domain = 'governance.synthetix.io';
		const chainId = NETWORK_ID;

		if (signer && provider && walletAddress) {
			try {
				const body = {
					address: walletAddress,
				};
				let response = await fetch(NONCE_API_URL, {
					method: 'POST',
					body: JSON.stringify(body),
				});
				const nonceResponse: NonceResponse = await response.json();

				let signedMessage = new SiweMessage({
					domain: domain,
					address: walletAddress,
					chainId: chainId,
					uri: `https://${domain}`,
					version: '1',
					statement: 'Sign into Boardroom with this wallet',
					nonce: nonceResponse.data.nonce,
					issuedAt: new Date().toISOString(),
				});

				const signature = await signer.signMessage(signedMessage.prepareMessage());

				const message = {
					message: { ...signedMessage, signature },
				} as SIWEMessage;

				response = await fetch(BOARDROOM_SIGNIN_API_URL, {
					method: 'POST',
					body: JSON.stringify(message),
				});

				const signInResponse: SignInResponse = await response.json();
				setUuid(signInResponse.data.uuid);
				return signInResponse.data.uuid;
			} catch (e) {
				console.log(e);
			}
		}
	};

	const isUuidValidQuery = useIsUUIDValidQuery(uuid || '');
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
					uuid: signedInUuid,
				};
				let updateUserDetailsResponse = await fetch(UPDATE_USER_DETAILS_API_URL(walletAddress), {
					method: 'POST',
					body: JSON.stringify(body),
				});

				let updateUserDetailsResult =
					(await updateUserDetailsResponse.json()) as UpdateUserDetailsResponse;

				let updateDelegationPitchResult = {
					data: {},
				};

				if (userProfile.delegationPitch) {
					const delegationPitchesBody = {
						protocol: 'synthetix',
						address: walletAddress,
						delegationPitch: userProfile.delegationPitch,
						uuid: signedInUuid,
					};
					let delegationUpdateReponse = await fetch(UPDATE_USER_PITCH_FOR_PROTOCOL, {
						method: 'POST',
						body: JSON.stringify(delegationPitchesBody),
					});
					updateDelegationPitchResult = await delegationUpdateReponse.json();
				}

				return { ...updateUserDetailsResult.data, ...updateDelegationPitchResult.data };
			} else {
				return new Error();
			}
		},
		{
			onSuccess: async () => {
				await queryClient.resetQueries({ active: true, stale: true, queryKey: 'userDetails' });
			},
		}
	);
}

export default useUpdateUserDetailsMutation;
