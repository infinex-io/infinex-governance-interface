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
	networkId: number;
	provider?: ethers.providers.Provider;
	signer?: ethers.Signer;
}): any {
	let contracts: ethers.Contract[] = [];

	if (networkId) {
		const SpartanCouncilModule = new ethers.Contract(
			ElectionModuleAddress,
			ElectionModuleABI.abi,
			signer ?? provider
		);

		contracts.push(SpartanCouncilModule);

		// const AmbassadorCouncilModule = new ethers.Contract(
		// 	ElectionModuleAddress,
		// 	ElectionModuleABI.abi,
		// signer ?? provider
		// );

		// contracts.push(AmbassadorCouncilModule);

		// const GrantsCouncilModule = new ethers.Contract(
		// 	ElectionModuleAddress,
		// 	ElectionModuleABI.abi,
		// signer ?? provider
		// );

		// contracts.push(GrantsCouncilModule);

		// const TreasuryCouncilModule = new ethers.Contract(
		// 	ElectionModuleAddress,
		// 	ElectionModuleABI.abi,
		// signer ?? provider
		// );

		// contracts.push(TreasuryCouncilModule);
	}

	return { contracts };
}

export const ElectionModuleContext = React.createContext<any | null>(null);
export const ElectionModuleContextProvider = ElectionModuleContext.Provider;
