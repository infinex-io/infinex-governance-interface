import { ethers } from 'ethers';

export const hexStringBN = (value) => ethers.BigNumber.from(value).toHexString();
