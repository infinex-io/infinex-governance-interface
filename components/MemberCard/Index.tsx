import {
	Button,
	Card,
	DiscordIcon,
	Dropdown,
	Flex,
	IconButton,
	ThreeDotsKebabIcon,
	TwitterIcon,
} from 'components/old-ui';
import { H5 } from 'components/Headlines/H5';
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
import { Dialog } from '@synthetixio/ui';
import WithdrawVote from 'components/Modals/WithdrawVote';
import Link from 'next/link';

interface MemberCardProps {
	member: GetUserDetails;
	isVoting?: boolean;
	onClick?: (address: string) => void;
}

export default function MemberCard({ member, isVoting, onClick }: MemberCardProps) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const [isWithdrawVoteOpen, setIsWithdrawVoteOpen] = useState(false);
	const { walletAddress } = useConnectorContext();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const { setContent, setIsOpen } = useModalContext();
	const isOwnCard = walletAddress?.toLocaleLowerCase() === member.address.toLowerCase();
	const { data } = useGetMemberBelongingQuery(member.address);

	const dropdownItems = [
		isVoting ? (
			<StyledDropdownText
				key={`${walletAddress}-modal`}
				color="lightBlue"
				onClick={(e) => {
					e.stopPropagation();
					if (data) {
						setIsWithdrawVoteOpen(true);
					}
				}}
			>
				{t('councils.dropdown.withdraw-vote')}
			</StyledDropdownText>
		) : (
			<StyledDropdownText
				key={`${walletAddress}-modal`}
				color="lightBlue"
				onClick={(e) => {
					e.stopPropagation();
					if (data) {
						setContent(
							<WithdrawNominationModal council={data.name} deployedModule={data.module} />
						);
						setIsOpen(true);
					}
				}}
			>
				{t('councils.dropdown.withdraw')}
			</StyledDropdownText>
		),
		<StyledDropdownText
			key={`${walletAddress}-text`}
			color="lightBlue"
			onClick={() => {
				push({ pathname: '/profile', query: { address: walletAddress } });
			}}
		>
			{t('councils.dropdown.edit')}
		</StyledDropdownText>,
		<Link href={`https://optimistic.etherscan.io/address/${member.address}`} passHref>
			<a target="_blank" rel="noreferrer">
				<StyledDropdownText key={`${walletAddress}-title`} color="lightBlue">
					{t('councils.dropdown.etherscan')}
				</StyledDropdownText>
			</a>
		</Link>,
	];

	return (
		<Card
			onClick={(e) => {
				e.stopPropagation();
				onClick && onClick(member.address);
			}}
			color={isOwnCard ? 'orange' : 'purple'}
			key={member.address.concat(member.about)}
			className="cursor-pointer p-1"
		>
			<StyledCardContent className="darker-60" direction="column" alignItems="center">
				<StyledCardImage src={parseURL(member.pfpThumbnailUrl)} />
				<H5>{member.ens || member.username}</H5>
				<Text>{member.about}</Text>
				{member.discord && <DiscordIcon />}
				{member.twitter && <TwitterIcon />}
				<Flex justifyContent="center">
					<StyledButton
						variant="secondary"
						onClick={() => {
							if (isVoting && data) {
								setContent(
									<VoteModal member={member} deployedModule={data.module} council={data.name} />
								);
								setIsOpen(true);
							} else if (isOwnCard && data && !isVoting) {
								setContent(<EditModal council={data.name} deployedModule={data.module} />);
								setIsOpen(true);
							} else {
								push({
									pathname: 'profile',
									query: {
										address: member.address,
									},
								});
							}
						}}
						disabled={!data}
					>
						{isOwnCard && isVoting
							? t('vote.card-title')
							: isOwnCard
							? t('councils.edit-nomination')
							: t('councils.view-member')}
					</StyledButton>
					{isOwnCard && (
						<IconButton
							onClick={(e) => {
								e.stopPropagation();
								setIsDropdownOpen(!isDropdownOpen);
							}}
							size="tiniest"
							active
						>
							<ThreeDotsKebabIcon active={isDropdownOpen} />
						</IconButton>
					)}
					{isDropdownOpen && <StyledDropdown color="purple" elements={dropdownItems} />}
				</Flex>
			</StyledCardContent>
			<Dialog
				className="bg-purple min-h-full min-h-full"
				wrapperClass="min-w-[90%]  min-h-[90%] p-0"
				onClose={() => setIsOpen(false)}
				open={isWithdrawVoteOpen}
			>
				<WithdrawVote address={member.address} />
			</Dialog>
		</Card>
	);
}

const StyledCardContent = styled(Flex)`
	width: 100%;
	height: 100%;
	padding: ${({ theme }) => theme.spacings.tiny};
	position: relative;
`;

const StyledCardImage = styled.img`
	width: 56px;
	height: 56px;
	border-radius: 50%;
`;
const StyledButton = styled(Button)`
	width: 100px;
`;

const StyledBackIconWrapper = styled(Flex)`
	position: absolute;
	top: 110px;
	left: ${({ theme }) => theme.spacings.biggest};
	> * {
		margin-right: ${({ theme }) => theme.spacings.medium};
	}
`;

const StyledDropdown = styled(Dropdown)`
	position: absolute;
	bottom: -50px;
	width: 200px;
`;

const StyledDropdownText = styled(Text)`
	padding: ${({ theme }) => theme.spacings.tiniest};
	cursor: pointer;
	width: 100%;
`;
