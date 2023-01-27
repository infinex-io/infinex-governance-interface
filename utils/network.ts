import { NetworkId, NetworkName, NetworkNameById } from '@synthetixio/contracts-interface';

export type Network = {
	id: NetworkId;
	name: NetworkName;
	useOvm: boolean;
};
export function isSupportedNetworkId(id: number | string): id is NetworkId {
	return id == 10 || id == 1;
}
export const getIsOVM = (networkId: number): boolean => !!~[10, 69].indexOf(networkId);
