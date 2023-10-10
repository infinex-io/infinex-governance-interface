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
               const response = await fetch(`${process.env.NEXT_PUBLIC_FARMING_API}/stake?address=${walletAddress}`, {
                  method: 'POST',
                  body: JSON.stringify({...stakeData, address_signature: "signature" , address: walletAddress}),
               });

               if (!response.ok) {
                  throw new Error('Network response was not ok');
               }
                              
               return response.json();

            } catch (error: Error | any) {
                throw new Error(error);
            }
        }
    );
}

export default useStakeTokenMutation;
