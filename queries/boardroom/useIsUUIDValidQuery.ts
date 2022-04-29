import { VALID_UUID_API_URL } from 'constants/boardroom';
import Connector from 'containers/Connector';
import { useQuery } from 'react-query';

type UUIDResponse = {
	data: {
		success: boolean;
	};
};

function useIsUUIDValidQuery() {
	const { walletAddress, uuid } = Connector.useContainer();
	return useQuery<boolean>(
		['isUUIDValid'],
		async () => {
			const body = { address: walletAddress, uuid: uuid };

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
