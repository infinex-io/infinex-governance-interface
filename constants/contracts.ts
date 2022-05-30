import { Contract } from 'ethers';

export const SNXL2 = new Contract('0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4', [
	'function balanceOf(address _owner) public view returns (uint256 balance)',
]);
