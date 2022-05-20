import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, Card, Carousel, DiscordIcon, Flex, Tabs, TwitterIcon } from 'components/old-ui';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { parseURL } from 'utils/ipfs';
import { H5 } from 'components/Headlines/H5';
import { Text } from 'components/Text/text';
import { useRouter } from 'next/router';
import useAllCouncilMembersQuery from 'queries/members/useAllCouncilMembersQuery';

interface CouncilsCarouselProps {
	maxWidth?: string;
	startIndex?: number;
}

export default function CouncilsCarousel({ maxWidth, startIndex, ...rest }: CouncilsCarouselProps) {
	const { push } = useRouter();
	const { t } = useTranslation();
	const [activeIndex, setActiveIndex] = useState(0);
	const councilTabs = [
		t('landing-page.tabs.all'),
		t('landing-page.tabs.sc'),
		t('landing-page.tabs.gc'),
		t('landing-page.tabs.ac'),
		t('landing-page.tabs.tc'),
	];

	const members = useAllCouncilMembersQuery();

	const allMembers = [
		members.data?.spartan.length &&
		members.data.grants.length &&
		members.data.ambassador.length &&
		members.data.treasury.length
			? members.data?.spartan.concat(
					members.data?.grants,
					members.data?.ambassador,
					members.data?.treasury
			  )
			: [],
		members.data?.spartan,
		members.data?.grants,
		members.data?.ambassador,
		members.data?.treasury,
	];
	return (
		<Flex direction="column" alignItems="center" {...rest}>
			<Tabs
				titles={councilTabs}
				clicked={(index) => typeof index === 'number' && setActiveIndex(index)}
				justifyContent="center"
				activeIndex={activeIndex}
				icons={[
					<StyledTabIcon key="all-council-members" active={activeIndex === 0}>
						{allMembers[0]?.length}
					</StyledTabIcon>,
					<StyledTabIcon key="spartan-council-tab" active={activeIndex === 1}>
						{members.data?.spartan.length}
					</StyledTabIcon>,
					<StyledTabIcon key="grants-council-tab" active={activeIndex === 2}>
						{members.data?.grants.length}
					</StyledTabIcon>,
					<StyledTabIcon key="ambassador-council-tab" active={activeIndex === 3}>
						{members.data?.ambassador.length}
					</StyledTabIcon>,
					<StyledTabIcon key="treasury-council-tab" active={activeIndex === 4}>
						{members.data?.treasury.length}
					</StyledTabIcon>,
				]}
			/>
			{allMembers[activeIndex] && (
				<Carousel
					startIndex={startIndex ? startIndex : 1}
					widthOfItems={300}
					carouselItems={(allMembers[activeIndex] as GetUserDetails[]).map((member) => {
						return (
							<StyledCarouselCard key={member.address} color="purple">
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
									<StyledButton
										variant="secondary"
										onClick={() => {
											push({
												pathname: 'profile',
												query: {
													address: member.address,
												},
											});
										}}
									>
										{t('landing-page.view-member')}
									</StyledButton>
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
	font-size: 0.5rem;
	font-family: 'Inter Bold';
`;

const StyledCarouselCard = styled(Card)`
	width: 200px;
	margin: 40px;
`;

const StyledCarouselCardContent = styled(Flex)`
	width: 100%;
	height: 100%;
	padding: ${({ theme }) => theme.spacings.tiny};
`;

const StyledCarouselCardImage = styled.img`
	width: 56px;
	height: 56px;
	border-radius: 50%;
`;
const StyledButton = styled(Button)`
	width: 100px;
`;
