import { VALID_UUID_API_URL } from 'constants/boardroom';
import { useConnectorContext } from 'containers/Connector';
import { useQuery } from 'react-query';
import { useAccount } from 'wagmi';

type UUIDResponse = {
	data: {
		success: boolean;
	};
};

function useIsUUIDValidQuery(uuid: string) {
	const account = useAccount();
	return useQuery<boolean>(
		['isUUIDValid'],
		async () => {
			const body = { address: account.data?.address, uuid };

			let response = await fetch(VALID_UUID_API_URL, {
				method: 'POST',
				body: JSON.stringify(body),
			});

			const { data } = (await response.json()) as UUIDResponse;

			return data.success as boolean;
		},
		{
			enabled: account.data?.address !== null && uuid !== null,
		}
	);
}

export default useIsUUIDValidQuery;
