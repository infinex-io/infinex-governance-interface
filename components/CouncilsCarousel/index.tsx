import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'components/old-ui';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import useAllCouncilMembersQuery from 'queries/members/useAllCouncilMembersQuery';
import MemberCard from 'components/MemberCard/Index';
import { Carousel } from '@synthetixio/ui';
import { TabIcon } from 'components/TabIcon';

interface CouncilsCarouselProps {
	startIndex?: number;
}

export default function CouncilsCarousel({ startIndex }: CouncilsCarouselProps) {
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
					<TabIcon key="all-members" isActive={activeIndex === 0}>
						{allMembers[0]?.length}
					</TabIcon>,
					<TabIcon key="spartan-members" isActive={activeIndex === 1}>
						{members.data?.spartan?.length}
					</TabIcon>,
					<TabIcon key="grants-members" isActive={activeIndex === 2}>
						{members.data?.grants.length}
					</TabIcon>,
					<TabIcon key="ambassador-members" isActive={activeIndex === 3}>
						{members.data?.ambassador.length}
					</TabIcon>,
					<TabIcon key="treasury-members" isActive={activeIndex === 4}>
						{members.data?.treasury.length}
					</TabIcon>,
				]}
			/>
			{allMembers[activeIndex]?.length && allMembers[activeIndex]!.length >= 4 ? (
				<>
					<div className="max-w-[912px] lg:block hidden">
						<Carousel
							startPosition={startIndex ? startIndex : 1}
							widthOfItems={300}
							carouselItems={(allMembers[activeIndex] as GetUserDetails[]).map((member, index) => (
								<MemberCard
									member={member}
									key={member.address.concat(String(index))}
									state="ADMINISTRATION"
									className="m-2 max-w-[218px]"
									council={member.council}
								/>
							))}
							arrowsPosition="outside"
							withDots
							dotsPosition="outside"
						/>
					</div>
					<div className="w-full flex overflow-x-auto lg:hidden">
						{(allMembers[activeIndex] as GetUserDetails[])?.map((member, index) => (
							<MemberCard
								member={member}
								key={member.address.concat(String(index))}
								state="ADMINISTRATION"
								className="m-2 max-w-[218px]"
								council={member.council}
							/>
						))}
					</div>
				</>
			) : (
				<div className="w-full flex overflow-x-auto justify-center">
					{(allMembers[activeIndex] as GetUserDetails[])?.map((member, index) => (
						<MemberCard
							member={member}
							key={member.address.concat(String(index))}
							state="ADMINISTRATION"
							className="m-2 max-w-[218px]"
							council={member.council}
						/>
					))}
				</div>
			)}
		</div>
	);
}
