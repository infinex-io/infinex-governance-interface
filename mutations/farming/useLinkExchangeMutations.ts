import { useMutation } from 'react-query';
import { useConnectorContext } from 'containers/Connector';


function useLinkExchangeMutations() {
    const { signer } = useConnectorContext();
    return useMutation(
        async (linkData: {
            exchange: string;
            api_key: string;
            secret_key: string;
            api_pass: string;
            type: string;
        }) => {

            console.log(linkData);
            try {
               let body;

                const message = "INFINEX:GOVERNANCE-FARM"
                const signature = await signer!.signMessage(message);
                const address = await signer?.getAddress()
         
               if (linkData.type === "dex"){
                  body = {
                      exchange: "dex",
                      address_signature: signature,
                      address
                  }
               } else {
                  body = {
                      ...linkData,
                     address_signature: signature,
                     address
                  }
               }
               const response = await fetch(`${process.env.NEXT_PUBLIC_FARMING_API}/calculate_volumes`, {
                  method: 'POST',
                  body: JSON.stringify(body),
               });

               if (!response.ok) {
                  throw new Error('Network response was not ok');
               }
               
               return response.json();

            } catch (error: Error | any) {
                throw new Error(error.message);
            }
        }
    );
}

export default useLinkExchangeMutations;
