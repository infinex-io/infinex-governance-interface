import { useMutation } from 'react-query';
import { useConnectorContext } from 'containers/Connector';

function useStakeTokenMutation() {
    const { walletAddress } = useConnectorContext();

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
