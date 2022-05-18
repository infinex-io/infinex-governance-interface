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
import WithdrawModal from 'components/Modals/WithdrawNomination';
import { Text } from 'components/Text/text';
import Connector from 'containers/Connector';
import Modal from 'containers/Modal';
import { useRouter } from 'next/router';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import useGetMemberBelongingQuery from 'queries/nomination/useGetMemberBelongingQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { parseURL } from 'utils/ipfs';

interface MemberCardProps {
	member: GetUserDetails;
	isVoting?: boolean;
}

export default function MemberCard({ member, isVoting }: MemberCardProps) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { walletAddress } = Connector.useContainer();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const { setContent, setIsOpen } = Modal.useContainer();
	const isOwnCard = walletAddress?.toLocaleLowerCase() === member.address.toLowerCase();
	const { data } = useGetMemberBelongingQuery(member.address);
	return (
		<StyledCard color={isOwnCard ? 'orange' : 'purple'} key={member.address}>
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
							if (isOwnCard && data) {
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
					>
						{isOwnCard ? t('councils.edit-nomination') : t('councils.view-member')}
					</StyledButton>
					{isOwnCard && (
						<IconButton onClick={() => setIsDropdownOpen(!isDropdownOpen)} size="tiniest" active>
							<ThreeDotsKebabIcon active={isDropdownOpen} />
						</IconButton>
					)}
					{isDropdownOpen && (
						<StyledDropdown
							color="purple"
							elements={[
								<StyledDropdownText
									key={`${walletAddress}-modal`}
									color="lightBlue"
									onClick={() => {
										if (data) {
											setContent(
												<WithdrawModal council={data.name} deployedModule={data.module} />
											);
											setIsOpen(true);
										}
									}}
								>
									{t('councils.dropdown.withdraw')}
								</StyledDropdownText>,
								<StyledDropdownText
									key={`${walletAddress}-text`}
									color="lightBlue"
									onClick={() => {
										push({ pathname: '/profile', query: { address: walletAddress } });
									}}
								>
									{t('councils.dropdown.edit')}
								</StyledDropdownText>,
								<StyledDropdownText key={`${walletAddress}-title`} color="lightBlue">
									{t('councils.dropdown.etherscan')}
								</StyledDropdownText>,
							]}
						/>
					)}
				</Flex>
			</StyledCardContent>
		</StyledCard>
	);
}

const StyledCard = styled(Card)`
	width: 200px;
	margin: 40px;
`;

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
