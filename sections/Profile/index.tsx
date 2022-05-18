import {
	ArrowLeftIcon,
	Flex,
	IconButton,
	ThreeDotsKebabIcon,
	Button,
	Card,
} from 'components/old-ui';
import Avatar from 'components/Avatar';
import CouncilsCarousel from 'components/CouncilsCarousel';
import { H1 } from 'components/Headlines/H1';
import { H3 } from 'components/Headlines/H3';
import { H4 } from 'components/Headlines/H4';
import { H5 } from 'components/Headlines/H5';
import EditProfileModal from 'components/Modals/EditProfile';
import { TextBold } from 'components/Text/bold';
import { Text } from 'components/Text/text';
import Connector from 'containers/Connector';
import Modal from 'containers/Modal';
import { useRouter } from 'next/router';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import useAllCouncilMembersQuery from 'queries/members/useAllCouncilMembersQuery';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { truncateAddress } from 'utils/truncate-address';

export default function ProfileSection({ walletAddress }: { walletAddress: string }) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const userDetailsQuery = useUserDetailsQuery(walletAddress);
	const { setIsOpen, setContent } = Modal.useContainer();
	const { walletAddress: ownAddress } = Connector.useContainer();
	const allMembers = useAllCouncilMembersQuery();

	const isPartOf = useMemo(() => {
		if (allMembers.data?.spartan.filter((member) => member.address === walletAddress).length)
			return 'Spartan';
		if (allMembers.data?.grants.filter((member) => member.address === walletAddress).length)
			return 'Grants';
		if (allMembers.data?.ambassador.filter((member) => member.address === walletAddress).length)
			return 'Ambassador';
		if (allMembers.data?.treasury.filter((member) => member.address === walletAddress).length)
			return 'Treasury';
		return;
	}, [walletAddress]);
	if (userDetailsQuery.isSuccess && userDetailsQuery.data && allMembers.isSuccess) {
		const {
			address,
			pfpThumbnailUrl,
			username,
			ens,
			about,
			twitter,
			discord,
			delegationPitches,
			github,
		} = userDetailsQuery.data;

		let parsedDelegationPitch = {
			synthetix: '',
		};

		if (delegationPitches) {
			parsedDelegationPitch = JSON.parse(delegationPitches);
		}

		return (
			<StyledProfileWrapper direction="column" alignItems="center">
				<StyledBackIconWrapper alignItems="center">
					<IconButton active onClick={() => push({ pathname: '/' })} rounded size="tiniest">
						<ArrowLeftIcon active />
					</IconButton>
					<TextBold color="lightBlue">{t('councils.back-btn')}</TextBold>
				</StyledBackIconWrapper>
				<StyledAvatarWrapper
					isOwnAccount={ownAddress === walletAddress}
					direction="column"
					alignItems="center"
				>
					<Avatar url={pfpThumbnailUrl} walletAddress={walletAddress} />
					{isPartOf && (
						<Card color="green">
							<div>{t('profiles.council', isPartOf)}</div>
						</Card>
					)}
					<Flex justifyContent="space-between" alignItems="center">
						<H1>{username ? username : ens ? ens : truncateAddress(walletAddress)}</H1>
						{ownAddress === walletAddress && (
							<IconButton
								style={{ height: '100%' }}
								active
								size="tiniest"
								onClick={() => {
									setContent(<EditProfileModal userProfile={userDetailsQuery.data} />);
									setIsOpen(true);
								}}
							>
								<ThreeDotsKebabIcon />
							</IconButton>
						)}
					</Flex>
					<Text>{about}</Text>
				</StyledAvatarWrapper>
				<Flex direction="column">
					<H4 align="start">{t('profiles.subheadline')}</H4>
					<StyledProfileBox direction="column">
						<Flex justifyContent="space-between">
							<Avatar url={pfpThumbnailUrl} walletAddress={walletAddress} />
							<Flex direction="column">
								<H5 color="grey">{t('profiles.discord')}</H5>
								<H3>{discord}</H3>
							</Flex>
							<Flex direction="column">
								<H5 color="grey">{t('profiles.github')}</H5>
								<H3>{github}</H3>
							</Flex>
							<Flex direction="column">
								<H5 color="grey">{t('profiles.twitter')}</H5>
								<H3>{twitter}</H3>
							</Flex>
							<Flex direction="column">
								<H5 color="grey">{t('profiles.currentVotingWeight')}</H5>
								<H3>{12241}</H3>
							</Flex>
							<Flex direction="column">
								<H5 color="grey">{t('profiles.participatedVotes')}</H5>
								<H3>{1242112}</H3>
							</Flex>
						</Flex>
						<StyledSpacer />
						<Flex direction="column" alignItems="flex-start">
							<H5 color="grey">{t('profiles.wallet')}</H5>
							<TextBold color="white">{address}</TextBold>
						</Flex>
						<StyledSpacer />
						<Flex direction="column" alignItems="flex-start">
							<H5 color="grey">{t('profiles.pitch')}</H5>
							<Text color="white">{parsedDelegationPitch.synthetix}</Text>
						</Flex>
					</StyledProfileBox>
				</Flex>
				<CouncilsCarousel />
				<StyledButton variant="primary" onClick={() => push({ pathname: '/councils' })}>
					{t('profiles.view-all-members')}
				</StyledButton>
			</StyledProfileWrapper>
		);
	} else {
		return <>loading...</>;
	}
}

const StyledProfileWrapper = styled(Flex)`
	padding-bottom: ${({ theme }) => theme.spacings.biggest};
`;

const StyledBackIconWrapper = styled(Flex)`
	position: absolute;
	top: 110px;
	left: ${({ theme }) => theme.spacings.biggest};
	> * {
		margin-right: ${({ theme }) => theme.spacings.medium};
	}
`;

const StyledAvatarWrapper = styled(Flex)<{ isOwnAccount?: boolean }>`
	background-image: ${({ isOwnAccount }) =>
		isOwnAccount ? 'url(/images/ring-orange.svg)' : 'url(/images/ring.svg)'};
	max-width: 780px;
	width: 100%;
	height: 100%;
	background-position: bottom center;
	background-repeat: no-repeat;
`;

const StyledProfileBox = styled(Flex)`
	background-color: ${({ theme }) => theme.colors.backgroundColor};
	box-shadow: 0px 14px 14px rgba(0, 0, 0, 0.25);
	border-radius: 10px;
	padding: ${({ theme }) => theme.spacings.big};
	min-width: 800px;
`;

const StyledSpacer = styled.div`
	background: rgba(130, 130, 149, 0.3);
	margin: ${({ theme }) => theme.spacings.medium};
	width: 90%;
	height: 1px;
`;

const StyledButton = styled(Button)`
	max-width: 250px;
`;
