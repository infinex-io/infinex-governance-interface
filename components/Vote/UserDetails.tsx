import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import { useTranslation } from 'react-i18next';
import Avatar from 'components/Avatar';
import { truncateAddress } from 'utils/truncate-address';

interface UserDetailsProps {
	walletAddress: string;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ walletAddress }) => {
	const userDetailsQuery = useUserDetailsQuery(walletAddress);

	if (!userDetailsQuery.data) return <div className="h-6 rounded bg-gray-600 w-32 animate-pulse" />;

	const member = userDetailsQuery.data;

	return (
		<div className="flex items-center">
			<Avatar
				className="w-6 h-6"
				scale={3}
				width={26}
				height={26}
				walletAddress={member.address}
				url={member.pfpThumbnailUrl}
			/>

			<h5 className="tg-title-h5 capitalize ml-2">
				{member.username || member.ens || truncateAddress(member.address)}
			</h5>
		</div>
	);
};
