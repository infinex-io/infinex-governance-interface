import { DiscordIcon, GitHubIcon, ThreeDotsKebabIcon, TwitterIcon } from 'components/old-ui';
import EditModal from 'components/Modals/EditNomination';
import WithdrawNominationModal from 'components/Modals/WithdrawNomination';
import { useModalContext } from 'containers/Modal';
import { useRouter } from 'next/router';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { useTranslation } from 'react-i18next';
import VoteModal from 'components/Modals/Vote';
import { Badge, Button, IconButton, Dropdown } from '@synthetixio/ui';
import Link from 'next/link';
import { EpochPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import { DeployedModules } from 'containers/Modules';
import WithdrawVoteModal from 'components/Modals/WithdrawVote';
import Avatar from 'components/Avatar';
import { truncateAddress } from 'utils/truncate-address';
import { compareAddress, urlIsCorrect } from 'utils/helpers';
import { useAccount } from 'wagmi';
import { copyToClipboard } from 'utils/helpers';
import clsx from 'clsx';
import { toast } from 'react-toastify';

interface MemberCardProps {
	member: GetUserDetails;
	state: keyof typeof EpochPeriods;
	deployedModule?: DeployedModules;
	council?: string;
	votedFor?: GetUserDetails;
	className?: string;
}

export default function MemberCard({
	member,
	state,
	deployedModule,
	council,
	votedFor,
	className,
}: MemberCardProps) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { data } = useAccount();
	const { setContent, setIsOpen } = useModalContext();
	const isOwnCard = compareAddress(data?.address, member.address);
	const votedForAlready = compareAddress(votedFor?.address, member.address);

	return (
		<div
			key={member.address.concat(member.about)}
			className={clsx('w-[210px] h-[285px] p-[1px] rounded-lg', className, {
				'bg-orange': isOwnCard,
				'bg-purple': !isOwnCard,
			})}
		>
			<div className="darker-60 relative flex flex-col items-center justify-between p-4 rounded-lg h-full">
				<Avatar
					width={56}
					height={56}
					walletAddress={member.address}
					url={member.pfpThumbnailUrl}
				/>
				{council && (
					<Badge variant="blue" className="mt-3 uppercase">
						{t('profiles.council', { council })}
					</Badge>
				)}
				<h5 className="tg-title-h5 capitalize">
					{member.username || member.ens || truncateAddress(member.address)}
				</h5>
				<span className="tg-caption text-gray-200 w-full truncate text-center">{member.about}</span>
				{(member.discord || member.twitter || member.github) && (
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
				)}
				<div className="flex justify-around w-full relative">
					{state === 'ADMINISTRATION' && (
						<div
							className={clsx('rounded', {
								'bg-dark-blue': isOwnCard,
							})}
						>
							<Button
								className="w-[180px]"
								variant="outline"
								onClick={(e) => {
									e.stopPropagation();
									push('/profile/' + member.address);
								}}
							>
								{t('councils.view-member')}
							</Button>
						</div>
					)}

					{state === 'NOMINATION' && (
						<div className="flex gap-2 items-center">
							<Button
								className={clsx({ 'w-[180px]': !isOwnCard })}
								variant="outline"
								onClick={(e) => {
									e.stopPropagation();
									if (isOwnCard) {
										setContent(<EditModal deployedModule={deployedModule!} council={council!} />);
										setIsOpen(true);
									} else {
										push('/profile/' + member.address);
									}
								}}
							>
								{isOwnCard ? t('councils.edit-nomination') : t('councils.view-nominee')}
							</Button>

							{isOwnCard && (
								<Dropdown
									triggerElement={
										<IconButton size="sm">
											<ThreeDotsKebabIcon />
										</IconButton>
									}
									contentClassName="bg-navy flex flex-col dropdown-border overflow-hidden"
									triggerElementProps={({ isOpen }: any) => ({ isActive: isOpen })}
									contentAlignment="right"
									renderFunction={({ handleClose }) => (
										<div className="flex flex-col">
											<span
												className="hover:bg-navy-dark-1 p-2 text-primary cursor-pointer"
												onClick={() => {
													handleClose();
													setContent(
														<WithdrawNominationModal
															deployedModule={deployedModule!}
															council={council!}
														/>
													);
													setIsOpen(true);
												}}
											>
												{t('councils.dropdown.withdraw')}
											</span>
											<Link href={`/profile/${member.address}`} passHref>
												<a className="hover:bg-navy-dark-1 bg-navy-light-1 p-2 text-primary cursor-pointer">
													{t('councils.dropdown.edit')}
												</a>
											</Link>
											<Link
												href={`https://optimistic.etherscan.io/address/${member.address}`}
												passHref
												key="etherscan-link"
											>
												<a
													target="_blank"
													rel="noreferrer"
													className="hover:bg-navy-dark-1 p-2 text-primary cursor-pointer"
												>
													<span key={`${member.address}-title`} color="lightBlue">
														{t('councils.dropdown.etherscan')}
													</span>
												</a>
											</Link>
										</div>
									)}
								/>
							)}
						</div>
					)}

					{state === 'VOTING' && (
						<div className="flex gap-2">
							<div
								className={clsx('rounded', {
									'bg-dark-blue': isOwnCard,
								})}
							>
								<Button
									variant="outline"
									onClick={(e) => {
										e.stopPropagation();
										if (votedForAlready) {
											setContent(
												<WithdrawVoteModal
													member={member}
													council={council!}
													deployedModule={deployedModule!}
												/>
											);
										} else {
											setContent(
												<VoteModal
													member={member}
													deployedModule={deployedModule!}
													council={council!}
												/>
											);
										}
										setIsOpen(true);
									}}
								>
									{votedForAlready ? t('vote.withdraw') : t('vote.vote-nominee')}
								</Button>
							</div>

							{isOwnCard && (
								<Dropdown
									triggerElement={
										<IconButton size="sm">
											<ThreeDotsKebabIcon />
										</IconButton>
									}
									contentClassName="bg-navy flex flex-col dropdown-border overflow-hidden"
									triggerElementProps={({ isOpen }: any) => ({ isActive: isOpen })}
									contentAlignment="right"
									renderFunction={() => (
										<div className="flex flex-col">
											<Link href={`/profile/${member.address}`} passHref>
												<a className="hover:bg-navy-dark-1 bg-navy-light-1 p-2 text-primary cursor-pointer">
													{t('councils.dropdown.edit')}
												</a>
											</Link>
											<Link
												href={`https://optimistic.etherscan.io/address/${member.address}`}
												passHref
												key="etherscan-link"
											>
												<a
													target="_blank"
													rel="noreferrer"
													className="hover:bg-navy-dark-1 p-2 text-primary cursor-pointer"
												>
													<span key={`${member.address}-title`} color="lightBlue">
														{t('councils.dropdown.etherscan')}
													</span>
												</a>
											</Link>
										</div>
									)}
								/>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);

	return <>...</>;
}
