import { useMutation } from 'react-query';
import { useConnectorContext } from 'containers/Connector';
import { SiweMessage } from 'siwe';


function useStakeTokenMutation() {
   const walletAddress = "0x4bEBFE533209EAa7FbD3d88de806B348A7baD860"
  
    return useMutation(
        async (stakeData: {
            token: string;
            amount: number;
            overide: boolean;
        }) => {
            console.log(stakeData);
            try {
               const response = await fetch(`https://uss5kwbs6e.execute-api.ap-southeast-2.amazonaws.com/dev/stake?address=${walletAddress}`, {
                  method: 'POST',
                  //  headers: {
                  //      'Content-Type': 'application/json',
                  //  },
                  body: JSON.stringify({...stakeData, address_signature: "signature" , address: walletAddress}),
               });

               if (!response.ok) {
                  throw new Error('Network response was not ok');
               }
               console.log(response)
               
               return response.json();

            } catch (error: Error | any) {
                throw new Error(error);
            }
        }
    );
}

export default useStakeTokenMutation;
