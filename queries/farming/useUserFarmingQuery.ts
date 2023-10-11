import { useQuery } from 'react-query';
import { useConnectorContext } from 'containers/Connector/Connector';

interface StakingData {
  [key: string]: number;
}

export type GetFarmingData = {
   staking: StakingData,
   volume: {
      [key: string]: number | string,
   },
   points: {
      [key: string]: any,
   }
}

function extractAndCombine(exchanges: {[key: string]: any}) {
  // Define an object to store the extracted volumes.
  const extractedVolumes: {[key: string]: any} = {};
  // Define the exchanges you want to extract and their corresponding keys.
  const exchangesToExtract = {
  binance: "binance",
  ftx: "ftx",
  kucoin: "kucoin",
  huobi: "huobi",
  bitmex: "bitmex",
  dydx: "dydx",
  gmx: "gmx",
  bybit: "bybit",
  okx: "okx",
  bitget: "bitget",
  mexc: "mexc",
  kraken: "kraken",
  "spot dex": "spot dex",
  snx: "snx"
};

  // Iterate through the exchanges and extract their volumes.
  for (const exchangeKey in exchanges) {
    if (exchangesToExtract.hasOwnProperty(exchangeKey)) {
      const key = exchangeKey as keyof typeof exchangesToExtract;
      extractedVolumes[exchangesToExtract[key]] = exchanges[exchangeKey];
    }
  }

  // Calculate the "dex" field by summing the volumes of all exchanges.
  let dexVolume = 0;
  for (const exchangeKey in exchanges) {
    if (!exchangesToExtract.hasOwnProperty(exchangeKey)) {
      dexVolume += exchanges[exchangeKey];
    }
  }

  // Add the "dex" field to the extracted volumes object.
  extractedVolumes["dex"] = dexVolume;

  return extractedVolumes;
}



function useUserFarmingQuery() {
   const { walletAddress } = useConnectorContext();
   
	return useQuery<GetFarmingData | undefined>(
		['userDetails', walletAddress],
		async () => {
			if (!walletAddress) return;
			return await GetFarmingData(walletAddress);
		},
		{
			enabled: walletAddress !== null,
			// staleTime: 30,
		}
	);
}

export default useUserFarmingQuery;

export async function GetFarmingData(walletAddress: string): Promise<GetFarmingData | undefined> {
   console.log("wallet address", walletAddress)

  try {
	  if (!walletAddress) return;

  
    const urls = [
      `${process.env.NEXT_PUBLIC_FARMING_API}/user?address=${walletAddress}`,
      `${process.env.NEXT_PUBLIC_FARMING_API}/stake?address=${walletAddress}`,
      `${process.env.NEXT_PUBLIC_FARMING_API}/points?address=${walletAddress}`,
    ];

    const fetchPromises = urls.map(url => fetch(url, { method: 'GET' }).then(response => response.json()));

    const [userVolumeData, userStakingData, userPointsData] = await Promise.all(fetchPromises);

    // Now, userVolumeData, userStakingData, and userPointsData contain the respective data
    const combinedExchangeVolume = {...userVolumeData.message, ...extractAndCombine(userVolumeData.message)};
    return {staking: userStakingData.message, volume: combinedExchangeVolume, points: userPointsData.message};

  } catch (error) {
    console.error('An error occurred:', error);
  }
  
}
