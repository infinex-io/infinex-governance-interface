import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { compareAddress } from './helpers';

export function sortToOwnCard(members: GetUserDetails[], walletAddress: string) {
	return members.sort((member) => (compareAddress(member.address, walletAddress) ? -1 : 1));
}
