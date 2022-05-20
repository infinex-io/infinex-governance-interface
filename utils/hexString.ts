import { ethers } from 'ethers';

export const hexStringBN = (value: number | string) => ethers.BigNumber.from(value).toHexString();
