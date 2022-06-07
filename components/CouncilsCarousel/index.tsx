import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'components/old-ui';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import useAllCouncilMembersQuery from 'queries/members/useAllCouncilMembersQuery';
import MemberCard from 'components/MemberCard/Index';
import { Carousel } from '@synthetixio/ui';
import clsx from 'clsx';

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
					<span
						key="all-council-members"
						className={clsx('tg-caption-sm rounded-full p-[4px] px-[8px]', {
							'bg-black': activeIndex === 0,
							'bg-primary': activeIndex !== 0,
							'text-white': activeIndex === 0,
							'text-black': activeIndex !== 0,
						})}
					>
						{allMembers[0]?.length}
					</span>,
					<span
						key="spartan-council-tab"
						className={clsx('tg-caption-sm rounded-full p-[4px] px-[8px]', {
							'bg-black': activeIndex === 1,
							'bg-primary': activeIndex !== 1,
							'text-white': activeIndex === 1,
							'text-black': activeIndex !== 1,
						})}
					>
						{members.data?.spartan.length}
					</span>,
					<span
						key="grants-council-tab"
						className={clsx('tg-caption-sm rounded-full p-[4px] px-[8px]', {
							'bg-black': activeIndex === 2,
							'bg-primary': activeIndex !== 2,
							'text-white': activeIndex === 2,
							'text-black': activeIndex !== 2,
						})}
					>
						{members.data?.grants.length}
					</span>,
					<span
						key="ambassador-council-tab"
						className={clsx('tg-caption-sm rounded-full p-[4px] px-[8px]', {
							'bg-black': activeIndex === 3,
							'bg-primary': activeIndex !== 3,
							'text-white': activeIndex === 3,
							'text-black': activeIndex !== 3,
						})}
					>
						{members.data?.ambassador.length}
					</span>,
					<span
						key="treasury-council-tab"
						className={clsx('tg-caption-sm rounded-full p-[4px] px-[8px]', {
							'bg-black': activeIndex === 4,
							'bg-primary': activeIndex !== 4,
							'text-white': activeIndex === 4,
							'text-black': activeIndex !== 4,
						})}
					>
						{members.data?.treasury.length}
					</span>,
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
									className="m-2	 max-w-[218px]"
									council={member.council}
								/>
							))}
							arrowsPosition="outside"
							withDots
							dotsPosition="outside"
						/>
					</div>
					<div className="w-full flex overflow-x-auto lg:hidden">
						{(allMembers[activeIndex] as GetUserDetails[]).map((member, index) => (
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
					{(allMembers[activeIndex] as GetUserDetails[]).map((member, index) => (
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
