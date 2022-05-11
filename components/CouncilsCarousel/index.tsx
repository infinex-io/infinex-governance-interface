import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Card, Carousel, DiscordIcon, Flex, Tabs, TwitterIcon } from '@synthetixio/ui';
import useUserDetailsQuery, { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { parseURL } from 'utils/ipfs';
import { H5 } from 'components/Headlines/H5';
import { Text } from 'components/Text';

interface CouncilsCarouselProps {
	maxWidth?: string;
	startIndex?: number;
	members: {
		spartanMembers: string[];
		grantsMembers: string[];
		ambassadorMembers: string[];
		treasuryMembers: string[];
	};
}

export default function CouncilsCarousel({
	maxWidth,
	startIndex,
	members,
	...rest
}: CouncilsCarouselProps) {
	const { t } = useTranslation();
	const [activeIndex, setActiveIndex] = useState(0);
	const councilTabs = [
		t('landing-pages.council-tabs.all'),
		t('landing-pages.council-tabs.spartan'),
		t('landing-pages.council-tabs.grants'),
		t('landing-pages.council-tabs.ambassador'),
		t('landing-pages.council-tabs.treasury'),
	];

	const spartanMembersWithInfoQuery = useUserDetailsQuery(members.spartanMembers);
	const grantsMembersWithInfoQuery = useUserDetailsQuery(members.grantsMembers);
	const ambassadorMembersWithInfoQuery = useUserDetailsQuery(members.ambassadorMembers);
	const treasuryMembersWithInfoQuery = useUserDetailsQuery(members.treasuryMembers);

	const spartanMembersWithInfo =
		spartanMembersWithInfoQuery.isSuccess && spartanMembersWithInfoQuery.data;
	const grantsMembersWithInfo =
		grantsMembersWithInfoQuery.isSuccess && grantsMembersWithInfoQuery.data;
	const ambassadorMembersWithInfo =
		ambassadorMembersWithInfoQuery.isSuccess && ambassadorMembersWithInfoQuery.data;
	const treasuryMembersWithInfo =
		treasuryMembersWithInfoQuery.isSuccess && treasuryMembersWithInfoQuery.data;

	const allMembers = [
		Array.isArray(spartanMembersWithInfo) &&
		Array.isArray(grantsMembersWithInfo) &&
		Array.isArray(ambassadorMembersWithInfo) &&
		Array.isArray(treasuryMembersWithInfo)
			? spartanMembersWithInfo.concat(
					grantsMembersWithInfo,
					ambassadorMembersWithInfo,
					treasuryMembersWithInfo
			  )
			: [],
		spartanMembersWithInfo,
		grantsMembersWithInfo,
		ambassadorMembersWithInfo,
		treasuryMembersWithInfo,
	];
	console.log(spartanMembersWithInfo);
	return (
		<Flex direction="column" alignItems="center" {...rest}>
			<Tabs
				titles={councilTabs}
				clicked={(index) => typeof index === 'number' && setActiveIndex(index)}
				justifyContent="center"
				activeIndex={activeIndex}
				icons={[
					<StyledTabIcon key="all-council-members" active={activeIndex === 0}>
						{members.ambassadorMembers.length +
							members.spartanMembers.length +
							members.grantsMembers.length +
							members.treasuryMembers.length}
					</StyledTabIcon>,
					<StyledTabIcon key="spartan-council-tab" active={activeIndex === 1}>
						{members.spartanMembers.length}
					</StyledTabIcon>,
					<StyledTabIcon key="grants-council-tab" active={activeIndex === 2}>
						{members.grantsMembers.length}
					</StyledTabIcon>,
					<StyledTabIcon key="ambassador-council-tab" active={activeIndex === 3}>
						{members.ambassadorMembers.length}
					</StyledTabIcon>,
					<StyledTabIcon key="treasury-council-tab" active={activeIndex === 4}>
						{members.treasuryMembers.length}
					</StyledTabIcon>,
				]}
			/>
			{Array.isArray(allMembers[activeIndex]) && (
				<Carousel
					startIndex={startIndex ? startIndex : 1}
					widthOfItems={300}
					carouselItems={(allMembers[activeIndex] as GetUserDetails[]).map((member) => {
						return (
							<StyledCarouselCard color="purple">
								<StyledCarouselCardContent
									className="darker-60"
									direction="column"
									alignItems="center"
								>
									<StyledCarouselCardImage src={parseURL(member.pfpThumbnailUrl)} />
									<H5>{member.ens || member.username}</H5>
									<Text>{member.about}</Text>
									{member.discord && <DiscordIcon />}
									{member.twitter && <TwitterIcon />}
								</StyledCarouselCardContent>
							</StyledCarouselCard>
						);
					})}
					maxWidth={maxWidth ? maxWidth : '90vw'}
					arrowsPosition="outside"
					withDots="secondary"
					dotsPosition="outside"
				/>
			)}
		</Flex>
	);
}

const StyledTabIcon = styled.span<{ active?: boolean }>`
	background-color: ${({ theme, active }) =>
		active ? theme.colors.black : theme.colors.lightBlue};
	border-radius: 15px;
	color: ${({ theme, active }) => (active ? theme.colors.white : theme.colors.black)};
	padding: 0px 8px;
	font-size: 0.66rem;
	font-family: 'Inter Bold';
`;

const StyledCarouselCard = styled(Card)`
	min-width: 300px;
	margin: 40px;
	padding: 0px;
`;

const StyledCarouselCardContent = styled(Flex)`
	width: 100%;
	height: 100%;
`;

const StyledCarouselCardImage = styled.img`
	width: 56px;
	height: 56px;
	border-radius: 50%;
`;
