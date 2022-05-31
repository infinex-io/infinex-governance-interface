import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Carousel, Tabs } from 'components/old-ui';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import useAllCouncilMembersQuery from 'queries/members/useAllCouncilMembersQuery';
import MemberCard from 'components/MemberCard/Index';

interface CouncilsCarouselProps {
	maxWidth?: string;
	startIndex?: number;
}

export default function CouncilsCarousel({ maxWidth, startIndex }: CouncilsCarouselProps) {
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
		<div className="flex flex-col items-center">
			<Tabs
				titles={councilTabs}
				size="medium"
				clicked={(index) => typeof index === 'number' && setActiveIndex(index)}
				className="mb-6 overflow-x-auto height-[150px] no-scrollbar"
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
					carouselItems={(allMembers[activeIndex] as GetUserDetails[]).map((member, index) => (
						<MemberCard
							member={member}
							key={member.address.concat(String(index))}
							state="ADMINISTRATION"
							className="m-2"
							council={member.council}
						/>
					))}
					maxWidth={maxWidth ? maxWidth : '80vw'}
					arrowsPosition="outside"
					withDots="secondary"
					dotsPosition="outside"
				/>
			)}
		</div>
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
