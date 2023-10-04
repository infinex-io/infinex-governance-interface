import { useMutation } from 'react-query';
import { useConnectorContext } from 'containers/Connector';
import { SiweMessage } from 'siwe';


function useLinkExchangeMutations() {
    const { signer } = useConnectorContext();


    return useMutation(
        async (stakeData: {
            exchange: string;
            api_key: string;
            secret_key: string;
            type: string;
        }) => {
        

            try {
               let body;

               const message = "INFINEX:ACCESS-TEST-123"
               let signedMessage = new SiweMessage(message);
			   const signature = await signer?.signMessage(signedMessage.prepareMessage());
         
               if (stakeData.type === "dex"){
                  body = {
                      exchange: "dex",
                      address_signature: signature
                  }
               }else {
                  body = {
                      ...stakeData,
                     address_signature: signature
                  }
               }
               const response = await fetch(`https://uss5kwbs6e.execute-api.ap-southeast-2.amazonaws.com/dev/calculate_volumes`, {
                  method: 'POST',
                  body: JSON.stringify(body),
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

export default useLinkExchangeMutations;
