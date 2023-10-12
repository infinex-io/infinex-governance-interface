export function extractDexExchangeEntries(data: Record<string, any>): Record<string, any> {
    const targetedExchanges = ['uniswap', 'sushiswap', 'curve'];
    const extractedData: Record<string, any> = {};
  
    Object.keys(data).forEach(key => {
      targetedExchanges.forEach(exchange => {
        if (key.startsWith(exchange)) {
          extractedData[key] = data[key];
        }
      });
    });
  
    return extractedData;
}

interface FilteredObject {
    [key: string]: number;
}

export function stripObjOfNonVolume(inputObj: any) {
    // Create an empty object to hold the filtered key-value pairs
    let filteredObj: FilteredObject = {};
    
    // Iterate through the keys of the input object
    for (let key in inputObj) {
        // Check if the key ends with "_status" or "_timestamp"
        if (!key.endsWith("_status") && !key.endsWith("_error") && !key.endsWith("_timestamp")) {
            // If it doesn't, add it to the filtered object
            filteredObj[key] = inputObj[key];
        }
    }
    
    return filteredObj;
}

export const sumValues = (obj: Record<string, number>): number => 
  Object.values(obj).reduce((acc, val) => acc + val, 0);