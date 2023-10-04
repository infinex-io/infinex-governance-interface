import { useMutation } from 'react-query';
import { useConnectorContext } from 'containers/Connector';
import { SiweMessage } from 'siwe';


function useStakeTokenMutation() {
   //  const { walletAddress , network } = useConnectorContext();
   const walletAddress = "0x4bEBFE533209EAa7FbD3d88de806B348A7baD860"
   const { signer } = useConnectorContext();
  

    return useMutation(
        async (stakeData: {
            token: string;
            amount: number;
            overide: boolean;
        }) => {

            console.log("stuff", stakeData)
            // let signedMessage = new SiweMessage({
				// 	address: "hello",
            // });
            // const signature = await signer?.signMessage(signedMessage.prepareMessage());

            const response = await fetch(`https://uss5kwbs6e.execute-api.ap-southeast-2.amazonaws.com/dev/stake?address=${walletAddress}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...stakeData, address_signature: "signature" , address: walletAddress}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // return response.json();
            
            return response.json();
        }
    );
}

export default useStakeTokenMutation;
