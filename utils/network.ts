import { NetworkId, NetworkName, NetworkNameById } from '@synthetixio/contracts-interface';

export type Network = {
	id: NetworkId;
	name: NetworkName;
	useOvm: boolean;
};

export const NETWORK_ID = parseInt(process.env.NEXT_PUBLIC_NETWORK_ID || '', 10) as NetworkId;

export function isSupportedNetworkId(id: number | string): id is NetworkId {
	return NETWORK_ID == id;
}
export const getIsOVM = (networkId: number): boolean => !!~[10, 69].indexOf(networkId);
