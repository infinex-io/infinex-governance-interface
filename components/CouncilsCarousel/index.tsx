import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'components/old-ui';
import { TabIcon } from 'components/TabIcon';
import { useAllCouncilMembersAddresses } from 'queries/members/useAllCouncilMembersAddresses';
import { CouncilCarousel } from './CouncilCarousel';

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

	const members = useAllCouncilMembersAddresses();

	if (
		members.isLoading ||
		!members.data?.spartan ||
		!members.data.grants ||
		!members.data.ambassador ||
		!members.data.treasury
	) {
		return null;
	}

	const spartan = members.data.spartan.map((address) => ({ address, council: 'spartan' }));
	const grants = members.data.grants.map((address) => ({ address, council: 'grants' }));
	const ambassador = members.data.ambassador.map((address) => ({ address, council: 'ambassador' }));
	const treasury = members.data.treasury.map((address) => ({ address, council: 'treasury' }));

	const allMembers = [
		spartan.concat(grants, ambassador, treasury),
		spartan,
		grants,
		ambassador,
		treasury,
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
			<CouncilCarousel members={allMembers[activeIndex] || []} startIndex={startIndex} />
		</div>
	);
}
