import { DiscordIcon, GitHubIcon, TwitterIcon } from 'components/old-ui';
import useUserDetailsQuery, { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { useTranslation } from 'react-i18next';
import { Badge } from '@synthetixio/ui';
import Link from 'next/link';
import { EpochPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import { DeployedModules } from 'containers/Modules';
import Avatar from 'components/Avatar';
import { truncateAddress } from 'utils/truncate-address';
import { compareAddress, urlIsCorrect } from 'utils/helpers';
import { useAccount } from 'wagmi';
import { copyToClipboard } from 'utils/helpers';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { MemberCardAction } from './MemberCardAction';

interface MemberCardProps {
	walletAddress: string;
	state: keyof typeof EpochPeriods;
	deployedModule?: DeployedModules;
	council?: string;
	votedFor?: GetUserDetails;
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
	const { data } = useAccount();
	const userDetailsQuery = useUserDetailsQuery(walletAddress);
	const isOwnCard = compareAddress(data?.address, walletAddress);

	if (userDetailsQuery.isLoading)
		return (
			<div
				className={clsx(
					'p-0.5 bg-purple rounded-lg',
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

	const socialMedia = (member.discord || member.twitter || member.github) && (
		<div className="flex items-center justify-center my-3 gap-4">
			{member.discord && (
				<DiscordIcon
					onClick={() => {
						copyToClipboard(member.discord);
						toast.success(t('copyClipboardMessage'));
					}}
					className="cursor-pointer"
					fill="white"
				/>
			)}

			{member.twitter && urlIsCorrect(member.twitter, 'https://twitter.com') && (
				<Link href={member.twitter} passHref>
					<a rel="noreferrer" target="_blank">
						<TwitterIcon fill="white" />
					</a>
				</Link>
			)}
			{member.github && urlIsCorrect(member.github, 'https://github.com') && (
				<Link href={member.github} passHref>
					<a rel="noreferrer" target="_blank">
						<GitHubIcon fill="white" />
					</a>
				</Link>
			)}
		</div>
	);

	const content = !listView ? (
		<>
			<Avatar width={56} height={56} walletAddress={member.address} url={member.pfpThumbnailUrl} />
			{council && (
				<Badge variant="blue" className="mt-3 uppercase">
					{t('profiles.council', { council })}
				</Badge>
			)}
			<h5 className="tg-title-h5 capitalize">
				{member.username || member.ens || truncateAddress(member.address)}
			</h5>
			<span className="opacity-75 tg-caption text-gray-200 w-full truncate text-center">
				{member.about}
			</span>
			{socialMedia}
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
	) : (
		<>
			<Avatar width={40} height={40} walletAddress={member.address} url={member.pfpThumbnailUrl} />
			<div className="relative flex flex-col flex-1 ml-3">
				<div
					className={clsx('flex items-center', {
						'mb-4': member.about,
					})}
				>
					<h5 className="tg-title-h5 capitalize">
						{member.username || member.ens || truncateAddress(member.address)}
					</h5>
					{council && (
						<Badge variant="blue" className="uppercase ml-4">
							{t('profiles.council', { council })}
						</Badge>
					)}
				</div>

				{member.about && (
					<p className="w-full bottom-0 left-0 pr-4 absolute opacity-75 tg-caption text-gray-200 truncate text-left">
						{member.about}
					</p>
				)}
			</div>
			<div className="flex items-center">
				{socialMedia}
				<div className="flex justify-around relative ml-4">
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
			</div>
		</>
	);

	return (
		<div
			key={member.address.concat(member.about)}
			className={clsx('p-[1px] rounded-lg', className, {
				'bg-orange': isOwnCard,
				'bg-purple': !isOwnCard,
				'xs:w-[210px] w-full max-w-full h-[285px]': !listView,
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
				{content}
			</div>
		</div>
	);
}
