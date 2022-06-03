import {
	BOARDROOM_SIGNIN_API_URL,
	NONCE_API_URL,
	UPDATE_USER_DETAILS_API_URL,
} from 'constants/boardroom';
import useIsUUIDValidQuery from 'queries/boardroom/useIsUUIDValidQuery';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { SiweMessage } from 'siwe';
import { useAccount, useProvider, useSigner } from 'wagmi';

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
	const { data: signer } = useSigner();
	const provider = useProvider();
	const account = useAccount();
	const [uuid, setUuid] = useState<null | string>(null);
	const boardroomSignIn = async () => {
		// TODO @andy: change to real domain on prod
		const domain = 'localhost:3000';

		const chainId = 31337;

		if (signer && provider && account.data?.address) {
			try {
				const body = {
					address: account.data?.address,
				};
				let response = await fetch(NONCE_API_URL, {
					method: 'POST',
					body: JSON.stringify(body),
				});
				const nonceResponse: NonceResponse = await response.json();

				let signedMessage = new SiweMessage({
					domain: domain,
					address: account.data.address,
					chainId: chainId,
					uri: `http:${domain}`,
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

	const { data } = useAccount();
	const isUuidValidQuery = useIsUUIDValidQuery(uuid || '');
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
					uuid: signedInUuid,
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
				await queryClient.resetQueries({ active: true, stale: true, queryKey: 'userDetails' });
			},
		}
	);
}

export default useUpdateUserDetailsMutation;
