import { useMutation } from 'react-query';
import { useConnectorContext } from 'containers/Connector';

function useStakeTokenMutation() {
    const { signer } = useConnectorContext();

    return useMutation(
        async (stakeData: {
            token: string;
            amount: number;
            overide: boolean;
        }) => {
            
            const message = "INFINEX:GOVERNANCE-FARM"
            const signature = await signer!.signMessage(message);
            const address = await signer?.getAddress()
            try {
               const response = await fetch(`${process.env.NEXT_PUBLIC_FARMING_API}/stake?address=${address}`, {
                  method: 'POST',
                  body: JSON.stringify({...stakeData, address_signature: signature , address: address}),
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
