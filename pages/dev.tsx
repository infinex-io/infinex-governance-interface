import { ethers } from 'ethers';
import { useState } from 'react';

export default function Dev() {
	const forkRPC = 'https://rpc.tenderly.co/fork/27035b39-4d4d-4945-9184-650c89d626cb';

	const provider = new ethers.providers.JsonRpcProvider(forkRPC);
	const signer = provider.getSigner();
	const [balance, setBalance] = useState<null | string>(null);
	const addFunds = async () => {
		const address = await signer.getAddress();
		// await provider.send('evm_increaseBlocks', [ethers.utils.hexValue(2)]);
		try {
			await provider.send('tenderly_addBalance', [
				[address],
				ethers.utils.hexValue(100), // hex encoded wei amount
			]);
		} catch (error) {
			console.error(error);
		}

		// await provider.send('evm_increaseBlocks', [ethers.utils.hexValue(2)]);
		signer.getBalance().then((x) => setBalance(x.toString()));
		signer.getBalance().then(console.log);
	};

	const increaseTime = async (time: number) => {
		//	await provider.send('evm_increaseTime', [ethers.utils.hexValue(time)]);
	};

	return (
		<div className=" flex flex-col items-center text-white text-center gap-y-5">
			DEV PAGE
			<button className="border-red border-2" onClick={addFunds}>
				ADD FUNDS
			</button>
			{balance}
			<button className="border-red border-2" onClick={() => increaseTime(5000000)}>
				INCREASE TIME
			</button>
		</div>
	);
}
