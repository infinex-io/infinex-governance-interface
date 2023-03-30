import { useMutation } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { BigNumber, Contract } from 'ethers';
import { useTransactionModalContext } from '@synthetixio/ui';
import { useConnectorContext } from 'containers/Connector';

type Address = string;

function useCastMutation(moduleInstance: DeployedModules) {
	const { setState } = useTransactionModalContext();
	const governanceModules = useModulesContext();
	const { walletAddress } = useConnectorContext();
	return useMutation('cast', async (addresses: Address[]) => {
		try {
			const ElectionModule = governanceModules[moduleInstance]?.contract;

			if (!walletAddress) throw new Error('Missing walletAddress');
			if (!ElectionModule) throw new Error('Missing contract');

			const claim = await getCrossChainClaim(ElectionModule, walletAddress);

			if (claim) {
				const crossChainDebt = await ElectionModule.getDeclaredCrossChainDebtShare(walletAddress);

				if (Number(crossChainDebt) === 0) {
					return transact(ElectionModule, 'declareAndCast', claim.amount, claim.proof, addresses);
				}
			}

			return transact(ElectionModule, 'cast', addresses);
		} catch (error) {
			setState('error');
			console.error(error);
		}
	});
}

async function transact(ElectionModule: any, methodName: string, ...args: any[]) {
	const gasLimit = await ElectionModule.estimateGas[methodName](...args);
	const tx = await ElectionModule[methodName](...args, { gasLimit });
	return tx;
}

export async function getCrossChainClaim(
	ElectionModule: Contract,
	walletAddress: string
): Promise<{ proof: string; amount: BigNumber } | null> {
	try {
		const blockNumber = await ElectionModule.getCrossChainDebtShareMerkleRootBlockNumber();
		// ${blockNumber}-
		const tree = await fetch(`/data/1-l1-debts.json`).then((res) => res.json());
		return tree?.claims[walletAddress] || null;
	} catch (err) {
		console.log(err);
		return null;
	}
}

export default useCastMutation;
