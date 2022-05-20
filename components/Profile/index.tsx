import {
	ArrowLeftIcon,
	Flex,
	IconButton,
	ThreeDotsKebabIcon,
	Card,
	Dropdown,
} from 'components/old-ui';
import Avatar from 'components/Avatar';
import CouncilsCarousel from 'components/CouncilsCarousel';
import { TextBold } from 'components/Text/bold';
import { Text } from 'components/Text/text';
import { useConnectorContext } from 'containers/Connector';
import { useRouter } from 'next/router';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import useAllCouncilMembersQuery from 'queries/members/useAllCouncilMembersQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { truncateAddress } from 'utils/truncate-address';
import { ProfileForm } from 'components/Forms/ProfileForm/ProfileForm';
import { Dialog, Button } from '@synthetixio/ui';
import useGetMemberCouncilNameQuery from 'queries/members/useGetMemberCouncilName';
import Link from 'next/link';

export default function ProfileSection({ walletAddress }: { walletAddress: string }) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const userDetailsQuery = useUserDetailsQuery(walletAddress);
	const [isOpen, setIsOpen] = useState(false);
	const [dropDownOpen, setDropDownOpen] = useState(false);
	const { walletAddress: ownAddress } = useConnectorContext();
	const allMembers = useAllCouncilMembersQuery();

	const { data } = useGetMemberCouncilNameQuery(walletAddress);
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

		const getDropdownElements = () => {
			const elements = [
				<Link href={`https://optimistic.etherscan.io/address/${address}`}>Etherscan</Link>,
			];
			if (discord) elements.unshift(<Link href={`https://discord.com/${discord}`}>Discord</Link>);
			if (twitter) elements.unshift(<Link href={`https://twitter.com/${twitter}`}>Twitter</Link>);
			return elements;
		};
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
					{data && (
						<Card color="green" className="max-w-[150px]">
							<div className="tg-subhead darker-60 text-center text-green">
								{t('profiles.council', { council: data })}
							</div>
						</Card>
					)}
					<div className="flex flex-col justify-between items-center relative">
						<h1 className="tg-title-h1">
							{username ? username : ens ? ens : truncateAddress(walletAddress)}

							<IconButton
								style={{ height: '100%' }}
								active
								size="tiniest"
								onClick={() => {
									if (ownAddress === walletAddress) setIsOpen(true);
									else setDropDownOpen(!dropDownOpen);
								}}
							>
								<ThreeDotsKebabIcon />
							</IconButton>
						</h1>

						{dropDownOpen && <Dropdown color="lightBlue" elements={getDropdownElements()} />}
						<Dialog wrapperClass="max-w-[700px]" onClose={() => setIsOpen(false)} open={isOpen}>
							<ProfileForm userProfile={userDetailsQuery.data} />
						</Dialog>
					</div>
					<Text>{about}</Text>
				</StyledAvatarWrapper>
				<div className="flex flex-col">
					<h4 className="tg-title-h4 text-start">{t('profiles.subheadline')}</h4>
					<StyledProfileBox direction="column">
						<div className="flex justify-between">
							<Avatar url={pfpThumbnailUrl} walletAddress={walletAddress} />
							<div className="flex flex-col">
								<h5 className="tg-title-h5 text-grey">{t('profiles.discord')}</h5>
								<h3 className="tg-title-h3">{discord}</h3>
							</div>
							<div className="flex flex-col">
								<h5 className="tg-title-h5 text-grey">{t('profiles.github')}</h5>
								<h3 className="tg-title-h3">{github}</h3>
							</div>
							<div className="flex flex-col">
								<h5 className="tg-title-h5 text-grey">{t('profiles.twitter')}</h5>
								<h3 className="tg-title-h3">{twitter}</h3>
							</div>
							<div className="flex flex-col">
								<h5 className="tg-title-h5 text-grey">{t('profiles.currentVotingWeight')}</h5>
								<h3 className="tg-title-h3">{12241}</h3>
							</div>
							<div className="flex flex-col">
								<h5 color="grey">{t('profiles.participatedVotes')}</h5>
								<h3 className="tg-title-h3">{1242112}</h3>
							</div>
						</div>
						<StyledSpacer />
						<div className="flex flex-col">
							<h5 className="tg-title-h5 text-grey">{t('profiles.wallet')}</h5>
							<TextBold color="white">{address}</TextBold>
						</div>
						<StyledSpacer />
						<div className="flex flex-col">
							<h5 className="tg-title-h5 text-grey">{t('profiles.pitch')}</h5>
							<Text color="white">{parsedDelegationPitch.synthetix}</Text>
						</div>
					</StyledProfileBox>
				</div>
				<CouncilsCarousel />
				<Button className="max-w-[250px]" onClick={() => push({ pathname: '/councils' })}>
					{t('profiles.view-all-members')}
				</Button>
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
