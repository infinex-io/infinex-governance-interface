import React from 'react';
import { ElectionModuleAddress } from 'constants/addresses';
import { ethers } from 'ethers';
import { NetworkId } from '@synthetixio/contracts-interface';
import ElectionModuleABI from 'contracts/ElectionModule.json';

export function createQueryContext({
	networkId,
	provider,
	signer,
}: {
	networkId: NetworkId | null;
	provider?: ethers.providers.Provider;
	signer?: ethers.Signer;
}): any {
	const SpartanCouncilModule = new ethers.Contract(
		ElectionModuleAddress,
		ElectionModuleABI.abi,
		signer
	);

	return { contracts: [SpartanCouncilModule] };
}

export const ElectionModuleContext = React.createContext<any | null>(null);
export const ElectionModuleContextProvider = ElectionModuleContext.Provider;
