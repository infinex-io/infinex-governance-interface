import { DiscordIcon, GitHubIcon, ThreeDotsKebabIcon, TwitterIcon } from 'components/old-ui';
import EditModal from 'components/Modals/EditNomination';
import WithdrawNominationModal from 'components/Modals/WithdrawNomination';

import { useModalContext } from 'containers/Modal';
import { useRouter } from 'next/router';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import VoteModal from 'components/Modals/Vote';
import { Badge, Button, Card, IconButton } from '@synthetixio/ui';
import Link from 'next/link';
import { EpochPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import { DeployedModules } from 'containers/Modules';
import WithdrawVoteModal from 'components/Modals/WithdrawVote';
import Avatar from 'components/Avatar';
import { truncateAddress } from 'utils/truncate-address';
import { compareAddress } from 'utils/helpers';
import { useAccount } from 'wagmi';

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
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const { data } = useAccount();
	const { setContent, setIsOpen } = useModalContext();
	const isOwnCard = compareAddress(data?.address, member.address);
	const votedForAlready = compareAddress(votedFor?.address, member.address);

	return (
		<Card
			variant={isOwnCard ? 'orange' : 'purple'}
			key={member.address.concat(member.about)}
			wrapperClassName={className}
			className="w-[210px] h-[285px] p-[1px] m-0"
		>
			<div className="darker-60 relative flex flex-col items-center justify-between p-4 rounded h-full">
				<Avatar
					width={56}
					height={56}
					walletAddress={member.address}
					url={member.pfpThumbnailUrl}
				/>
				{council && (
					<Badge variant="success" className="mt-3 uppercase">
						{t('profiles.council', { council })}
					</Badge>
				)}
				<h5 className="tg-title-h5">
					{member.username || member.ens || truncateAddress(member.address)}
				</h5>
				<span className="tg-caption text-gray-200 w-full truncate">{member.about}</span>
				{(member.discord || member.twitter || member.github) && (
					<div className="flex items-center justify-center my-3 gap-4">
						{member.discord && (
							<Link href={'https://discord.com/invite/' + member.discord} passHref>
								<a rel="noreferrer" target="_blank">
									<DiscordIcon fill="white" />
								</a>
							</Link>
						)}

						{member.twitter && (
							<Link href={'https://twitter.com/' + member.twitter} passHref>
								<a rel="noreferrer" target="_blank">
									<TwitterIcon fill="white" />
								</a>
							</Link>
						)}
						{member.github && (
							<Link href={'https://github.com/' + member.github} passHref>
								<a rel="noreferrer" target="_blank">
									<GitHubIcon fill="white" />
								</a>
							</Link>
						)}
					</div>
				)}
				<div className="flex justify-around w-full relative">
					{state === 'ADMINISTRATION' && (
						<Button
							variant="outline"
							onClick={(e) => {
								e.stopPropagation();
								push('/profile/' + member.address);
							}}
						>
							{t('councils.view-member')}
						</Button>
					)}

					{state === 'NOMINATION' && (
						<>
							<Button
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
								<IconButton
									onClick={(e) => {
										e.stopPropagation();
										setIsDropdownOpen(!isDropdownOpen);
									}}
									size="sm"
								>
									<ThreeDotsKebabIcon active={isDropdownOpen} />
								</IconButton>
							)}
							{isDropdownOpen && (
								<Card
									variant="primary"
									className="absolute flex flex-col p-1 top-[30px] right-[0px]"
								>
									{isOwnCard && (
										<span
											className="darker-60 w-full p-2 cursor-pointer hover:bg-primary"
											onClick={() => {
												setContent(
													<WithdrawNominationModal
														deployedModule={deployedModule!}
														council={council!}
													/>
												);
												setIsOpen(true);
												setIsDropdownOpen(!isDropdownOpen);
											}}
										>
											{t('councils.dropdown.withdraw')}
										</span>
									)}
									{isOwnCard && (
										<Link href={`/profile/${member.address}`} passHref>
											<a
												className="darker-60 w-full p-2 cursor-pointer hover:bg-primary"
												onClick={() => setIsDropdownOpen(!isDropdownOpen)}
											>
												{t('councils.dropdown.edit')}
											</a>
										</Link>
									)}
									<Link
										href={`https://optimistic.etherscan.io/address/${member.address}`}
										passHref
										key="etherscan-link"
									>
										<a
											target="_blank"
											rel="noreferrer"
											className="darker-60 hover:bg-primary p-2"
											onClick={() => setIsDropdownOpen(!isDropdownOpen)}
										>
											<span key={`${walletAddress}-title`} color="lightBlue">
												{t('councils.dropdown.etherscan')}
											</span>
										</a>
									</Link>
								</Card>
							)}
						</>
					)}

					{state === 'VOTING' && (
						<>
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
							{isOwnCard && (
								<IconButton
									onClick={(e) => {
										e.stopPropagation();
										setIsDropdownOpen(!isDropdownOpen);
									}}
									size="sm"
								>
									<ThreeDotsKebabIcon active={isDropdownOpen} />
								</IconButton>
							)}
							{isDropdownOpen && (
								<Card
									variant="primary"
									className="absolute flex flex-col p-1 top-[30px] right-[0px]"
								>
									{isOwnCard && (
										<Link href={`/profile/${member.address}`} passHref>
											<a
												className="darker-60 w-full p-2 cursor-pointer hover:bg-primary"
												onClick={() => setIsDropdownOpen(!isDropdownOpen)}
											>
												{t('councils.dropdown.edit')}
											</a>
										</Link>
									)}
									<Link
										href={`https://optimistic.etherscan.io/address/${member.address}`}
										passHref
										key="etherscan-link"
									>
										<a
											target="_blank"
											rel="noreferrer"
											className="darker-60 hover:bg-primary p-2"
											onClick={() => setIsDropdownOpen(!isDropdownOpen)}
										>
											<span key={`${walletAddress}-title`} color="lightBlue">
												{t('councils.dropdown.etherscan')}
											</span>
										</a>
									</Link>
								</Card>
							)}
						</>
					)}
				</div>
			</div>
		</Card>
	);

	return <>...</>;
}
