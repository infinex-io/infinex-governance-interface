import { VALID_UUID_API_URL } from 'constants/boardroom';
import { useQuery } from 'react-query';
import { useConnectorContext } from 'containers/Connector';

type UUIDResponse = {
	data: {
		success: boolean;
	};
};

function useIsUUIDValidQuery(uuid: string) {
	const { walletAddress } = useConnectorContext();
	return useQuery<boolean>(
		['isUUIDValid'],
		async () => {
			const body = { address: walletAddress, uuid };

			let response = await fetch(VALID_UUID_API_URL, {
				method: 'POST',
				body: JSON.stringify(body),
			});

			const { data } = (await response.json()) as UUIDResponse;

			return data.success as boolean;
		},
		{
			enabled: walletAddress !== null && uuid !== null,
		}
	);
}

export default useIsUUIDValidQuery;
