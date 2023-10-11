import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';

function useIsCC(
	walletAddress: string,
) {
	const governanceModules = useModulesContext();
	return useQuery<boolean>(
		[walletAddress],
		async () => {
			const contract = governanceModules['cc token']?.contract;
			let isCC = false;
            const tokenNum = await contract?.balanceOf(walletAddress);
			if (Number(tokenNum) > 0) isCC = true
			return isCC;
		},
		{
			enabled: governanceModules !== null && walletAddress !== null,
			staleTime: 900000,
		}
	);
}

export default useIsCC;
