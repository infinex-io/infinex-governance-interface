import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';

function useIsInvestoor(
	walletAddress: string,
) {
	const governanceModules = useModulesContext();
	return useQuery<boolean>(
		[walletAddress],
		async () => {
			const contract = governanceModules['investor_token']?.contract;
			let isInvestoor = false;
            const tokenNum = await contract?.balanceOf(walletAddress);
			if (Number(tokenNum) > 0) isInvestoor = true
			return isInvestoor;
		},
		{
			enabled: governanceModules !== null && walletAddress !== null,
			staleTime: 900000,
		}
	);
}

export default useIsInvestoor;
