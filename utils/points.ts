export function extractDexExchangeEntries(data: Record<string, any>): Record<string, any> {
    const targetedExchanges = ['uniswap', 'sushiswap', 'curve'];
    const extractedData: Record<string, any> = {};
  
    Object.keys(data).forEach(key => {
        console.log(key)
      targetedExchanges.forEach(exchange => {
        if (key.startsWith(exchange)) {
          extractedData[key] = data[key];
        }
      });
    });
  
    return extractedData;
}