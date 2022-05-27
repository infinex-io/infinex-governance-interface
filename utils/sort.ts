import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';

export function sortToOwnCard(members: GetUserDetails[], walletAddress: string) {
	let ownCardIndex: number;
	const ownCard = members.find((member, index) => {
		if (member.address === walletAddress) {
			ownCardIndex = index;
			return true;
		}
		return false;
	});
	if (ownCard) {
		const sortedArray =
			ownCardIndex! === members.length - 1
				? members.slice(0, ownCardIndex!)
				: members.slice(0, ownCardIndex!).concat(members.slice(ownCardIndex! + 1));
		sortedArray.unshift(ownCard);
		return sortedArray;
	}
	return members;
}
