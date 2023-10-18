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
               const email = localStorage.getItem('inf-email');
				const ref = localStorage.getItem('inf-ref')
				if (email !== null) {
					try {
						const body = {
							email: email,
							address_signature: signature,
							address: address,
							ref: ref !== null ? ref : ""
						};
						await fetch(`${process.env.NEXT_PUBLIC_FARMING_API}/email`, {
							method: 'POST',
							body: JSON.stringify(body),
						});
					} catch (error) {
						console.error(error);
					}
				}
               return response.json();

            } catch (error: Error | any) {
                throw new Error(error);
            }
        }
    );
}

export default useStakeTokenMutation;
