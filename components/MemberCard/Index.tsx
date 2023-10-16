import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import { useTranslation } from 'react-i18next';
import { Badge } from '@synthetixio/ui';
import { EpochPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import { DeployedModules } from 'containers/Modules';
import Avatar from 'components/Avatar';
import { truncateAddress } from 'utils/truncate-address';
import { compareAddress } from 'utils/helpers';
import { useConnectorContext } from 'containers/Connector';
import clsx from 'clsx';
import { MemberCardAction } from './MemberCardAction';
import { UserSocials } from './UserSocials';
import parseCouncil from 'utils/parseCouncil';

interface MemberCardProps {
	walletAddress: string;
	state: keyof typeof EpochPeriods;
	deployedModule?: DeployedModules;
	council?: string;
	votedFor?: string;
	className?: string;
	listView?: boolean;
}

export default function MemberCard({
	walletAddress,
	state,
	deployedModule,
	council,
	votedFor,
	className,
	listView,
}: MemberCardProps) {
	const { t } = useTranslation();
	const { walletAddress: userAddress } = useConnectorContext();
	const userDetailsQuery = useUserDetailsQuery(walletAddress);
	const isOwnCard = compareAddress(userAddress, walletAddress);

	if (userDetailsQuery.isLoading)
		return (
			<div
				className={clsx(
					'p-0.5 bg-slate-900 rounded-lg',
					{
						'xs:w-[210px] w-full max-w-full h-[283px]': !listView,
						'w-full h-[88px]': listView,
					},
					className
				)}
			>
				<div className="h-full darker-60 animate-pulse"></div>
			</div>
		);

	if (!userDetailsQuery.data) return null;
	const member = userDetailsQuery.data;
	console.log(member)

	return (
		member !== undefined && member.address !== undefined &&
		<div
			key={member.address.concat(member.about)}
			className={clsx('p-0.5 rounded-lg', className, {
				'bg-[#232334]': isOwnCard,
				'bg-[#182534]': !isOwnCard,
				'w-full xs:max-w-[210px] min-w-[210px] h-[285px]': !listView,
				'w-full': listView,
			})}
		>
			<div
				className={clsx(
					'darker-60 relative flex items-center justify-between p-4 rounded-lg h-full',
					{
						'flex-col': !listView,
					}
				)}
			>	
				{/* CONTENT WRAPPER */}
				<>
					<Avatar width={56} height={56} walletAddress={member.address} url={member.pfpThumbnailUrl} />
					{council && (
						<span
							className={`bg-[#15262A] text-[#31C690] p-2 rounded font-medium text-[11px] text-center my-2 uppercase w-fit self-center`}
							data-testid="cta-text"
						>
							{t('profiles.council', { council: parseCouncil(council as "trade" | "ecosystem" | "core-contributor" | "coreContributor" | "treasury") })}
						</span>
					)}
					<h5 className="tg-title-h5 capitalize">
						{member.username || member.ens || truncateAddress(member.address)}
					</h5>
					<span className="opacity-75 tg-caption text-gray-200 w-full truncate text-center">
						{member.about}
					</span>
					{/* SOCIALS */}
					{member.discord || member.twitter || member.github ? (
						<div className="flex items-center justify-center my-3 gap-4">
							<UserSocials discord={member.discord} twitter={member.twitter} github={member.github} />
						</div>
					) : (
						<div className="my-3" />
					)}
					<div className="flex justify-around w-full relative">
						<MemberCardAction
							state={state}
							isOwnCard={isOwnCard}
							member={member}
							votedFor={votedFor}
							walletAddress={walletAddress}
							deployedModule={deployedModule}
							council={council}
						/>
					</div>
				</>
			</div>
		</div>
	);
}
