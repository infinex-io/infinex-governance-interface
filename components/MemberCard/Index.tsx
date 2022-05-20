import {
	DiscordIcon,
	Dropdown,
	Card as OldCard,
	ThreeDotsKebabIcon,
	TwitterIcon,
} from 'components/old-ui';
import EditModal from 'components/Modals/EditNomination';
import WithdrawNominationModal from 'components/Modals/WithdrawNomination';
import { Text } from 'components/Text/text';
import { useConnectorContext } from 'containers/Connector';
import { useModalContext } from 'containers/Modal';
import { useRouter } from 'next/router';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import useGetMemberBelongingQuery from 'queries/nomination/useGetMemberBelongingQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { parseURL } from 'utils/ipfs';
import VoteModal from 'components/Modals/Vote';
import { Dialog, Button, Card, IconButton } from '@synthetixio/ui';
import WithdrawVote from 'components/Modals/WithdrawVote';
import Link from 'next/link';
import { EpochPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import { DeployedModules } from 'containers/Modules';

interface MemberCardProps {
	member: GetUserDetails;
	state: keyof typeof EpochPeriods;
	deployedModule?: DeployedModules;
	council?: string;
}

export default function MemberCard({ member, state, deployedModule, council }: MemberCardProps) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const [isWithdrawVoteOpen, setIsWithdrawVoteOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const { walletAddress } = useConnectorContext();
	const { setContent, setIsOpen } = useModalContext();
	const isOwnCard = walletAddress?.toLocaleLowerCase() === member.address.toLowerCase();
	const { data } = useGetMemberBelongingQuery(member.address);

	if (state === 'ADMINISTRATION' && data) {
		return (
			<OldCard
				color={isOwnCard ? 'orange' : 'purple'}
				key={member.address.concat(member.about)}
				className="b-[1px] max-w-[210px] max-h-[290px]"
			>
				<div className="darker-60 relative flex flex-col items-center justify-between p-4 min-w-[200px] min-h-[280px]">
					<StyledCardImage src={parseURL(member.pfpThumbnailUrl)} />
					<h5 className="tg-title-h5">{member.ens || member.username}</h5>
					<Text>{member.about}</Text>
					{member.discord && <DiscordIcon />}
					{member.twitter && <TwitterIcon />}
					<div className="flex justify-around w-full relative">
						<Button
							variant="outline"
							onClick={(e) => {
								e.stopPropagation();
								push('/profile/' + member.address);
							}}
						>
							{t('councils.view-member')}
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
							<Card variant="primary" className="absolute flex flex-col p-1 top-[30px] right-[0px]">
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
										key={`${walletAddress}-title`}
										onClick={() => setIsDropdownOpen(!isDropdownOpen)}
									>
										{t('councils.dropdown.etherscan')}
									</a>
								</Link>
							</Card>
						)}
					</div>
				</div>
			</OldCard>
		);
	}

	if (state === 'NOMINATION' && data) {
		return (
			<OldCard
				color={isOwnCard ? 'orange' : 'purple'}
				key={member.address.concat(member.about)}
				className="b-[1px] max-w-[210px] max-h-[290px]"
			>
				<div className="darker-60 relative flex flex-col items-center justify-between p-4 min-w-[200px] min-h-[280px]">
					<StyledCardImage src={parseURL(member.pfpThumbnailUrl)} />
					<h5 className="tg-title-h5">{member.ens || member.username}</h5>
					<Text>{member.about}</Text>
					{member.discord && <DiscordIcon />}
					{member.twitter && <TwitterIcon />}
					<div className="flex justify-around w-full relative">
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
							<Card variant="primary" className="absolute flex flex-col p-1 top-[30px] right-[0px]">
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
					</div>
				</div>
			</OldCard>
		);
	}
	if (state === 'VOTING' && data) {
		return (
			<OldCard
				color={isOwnCard ? 'orange' : 'purple'}
				key={member.address.concat(member.about)}
				className="b-[1px] max-w-[210px] max-h-[290px]"
			>
				<div className="darker-60 relative flex flex-col items-center justify-between p-4 min-w-[200px] min-h-[280px]">
					<StyledCardImage src={parseURL(member.pfpThumbnailUrl)} />
					<h5 className="tg-title-h5">{member.ens || member.username}</h5>
					<Text>{member.about}</Text>
					{member.discord && <DiscordIcon />}
					{member.twitter && <TwitterIcon />}
					<div className="flex justify-around w-full relative">
						<Button
							variant="outline"
							onClick={(e) => {
								e.stopPropagation();
								setContent(
									<VoteModal member={member} deployedModule={deployedModule!} council={council!} />
								);
								setIsOpen(true);
							}}
						>
							{t('vote.vote-nominee')}
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
							<Card variant="primary" className="absolute flex flex-col p-1 top-[30px] right-[0px]">
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
					</div>
				</div>
			</OldCard>
		);
	}
	return <>...</>;
}

const StyledCardImage = styled.img`
	width: 56px;
	height: 56px;
	border-radius: 50%;
`;
