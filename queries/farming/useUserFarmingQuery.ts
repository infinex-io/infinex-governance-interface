import { useQuery } from 'react-query';

export type GetFarmingData = {
   staking:{

   },
   volume: {
      curve_moonbeam: number,
      curve_gnosis: number,
      sushiswapV3_avalanche: number,
      dex_status: string,
      gmx_error: string,
      uniswapV3_bsc: number,
      bybit_error: string,
      curve_avalanche: number,
      uniswapV3_polygon: number,
      synthetix_error: string,
      sushiswapV3_arbitrum: number,
      uniswapV3_arbitrum: number,
      okx_status: string,
      sushiswap_fuse: number,
      gmx_status: string,
      sushiswapV3_moonriver: number,
      sushiswapV3_optimism: number,
      uniswapV3_optimism: number,
      kraken_status: string,
      kucoin: number,
      sushiswap_bsc: number,
      sushiswap_avalanche: number,
      okx_error: string,
      sushiswap_moonbeam: number,
      sushiswap_moonriver: number,
      bybit: number,
      curve_arbitrum: number,
      sushiswapV3_polygon: number,
      sushiswap_gnosis: number,
      binance_status: string,
      curve_optimism: number,
      bitget_status: string,
      sushiswap_fantom: number,
      sushiswapV3_fuse: number,
      sushiswapV3_bsc: number,
      uniswapV2_ethereum: number,
      curve_polygon: number,
      kucoin_error: string,
      sushiswapV3_ethereum: number,
      curve_ethereum: number,
      uniswapV3_ethereum: number,
      sushiswap_arbitrum: number,
      binance_error: string,
      dex_error: string,
      binance: number,
      uniswapV3_celo: number,
      synthetix_optimism: number,
      gmx_arbitrum: number,
      id: string,
      gmx_avalanche: number,
      bitget_error: string,
      sushiswap_harmony: number,
      sushiswap_celo: number,
      synthetix_status: string,
      sushiswap_ethereum: number,
      curve_fantom: number,
      uniswapV3_base: number,
      bybit_status: string,
      sushiswapV3_gnosis: number,
      sushiswapV3_fantom: number,
      bitget: number,
      okx: number,
      kucoin_status: string
   }
}


function useUserFarmingQuery(walletAddress: string) {
	return useQuery<GetFarmingData | undefined>(
		['userDetails', walletAddress],
		async () => {
			if (!walletAddress) return;
			return await GetFarmingData(walletAddress);
		},
		{
			enabled: walletAddress !== null,
			staleTime: 900000,
		}
	);
}

export default useUserFarmingQuery;

export async function GetFarmingData(walletAddress: string): Promise<GetFarmingData | undefined> {
	if (!walletAddress) return;

   let userVolumeResponse = await fetch(`https://uss5kwbs6e.execute-api.ap-southeast-2.amazonaws.com/dev/user?address=${walletAddress}`,{
      method: 'GET',
   });
   let userStakingResponse = await fetch(`https://uss5kwbs6e.execute-api.ap-southeast-2.amazonaws.com/dev/stake?address=${walletAddress}`,{
      method: 'GET',
   })
   

   let userVolumeData = await userVolumeResponse.json();
   let userStakingData = await userStakingResponse.json();


	return {staking: userStakingData.message, volume: userVolumeData.message};
}
