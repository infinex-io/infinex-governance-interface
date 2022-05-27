import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';

export function sortToOwnCard(members: GetUserDetails[], walletAddress: string) {
	return members.sort((member) => (member.address === walletAddress ? -1 : 1));
}
