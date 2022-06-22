import { wei } from '@synthetixio/wei';
import { BigNumber } from 'ethers';

export const compareAddress = (add1: string | null = '', add2: string | null = '') =>
	!!add1 && !!add2 && add1.toLowerCase() === add2.toLowerCase();

export const copyToClipboard = (value: string) => navigator.clipboard.writeText(value);

export const urlIsCorrect = (value: string, baseUrl: string) => value.includes(baseUrl);

export const shuffle = (array: any[]) => array.sort(() => 0.5 - Math.random());

export const calcPercentage = (a: BigNumber, b: BigNumber) => {
	return ((wei(a).toNumber() / (wei(b).toNumber() || 1)) * 100).toFixed(2);
};
