import { Pagination } from '@synthetixio/ui';
import clsx from 'clsx';
import MemberCard from 'components/MemberCard/Index';
import { Swiper } from 'components/Swiper';
import useIsMobile from 'hooks/useIsMobile';
import { usePaginate } from 'hooks/usePaginate';
import { useEffect, useState } from 'react';
import { CouncilStats } from './CouncilStats';

interface Props {
	members: string[];
	listView: boolean;
	council?: string;
}

export const CouncilCarousel = ({ members, listView, council }: Props) => {
	const isMobile = useIsMobile();
	const { activePage, setActivePage, pageSize, paginate } = usePaginate(5);

	const wrapperClassName = isMobile ? '' : 'container ';

	const getItems = () => [
		<CouncilStats
			className={clsx({ 'my-2': listView })}
			key={council}
			council={council}
			members={members.length}
			listView={listView}
		/>,
		...(listView ? paginate(members) : members).map((member, index) => (
			<MemberCard
				walletAddress={member}
				key={member.concat(String(index))}
				state="ADMINISTRATION"
				className={clsx({ 'my-2': listView })}
				council={council}
				listView={listView}
			/>
		)),
	];

	useEffect(() => {
		setActivePage(0);
	}, [members, setActivePage]);

	if (listView)
		return (
			<div className={wrapperClassName + 'w-full'}>
				<div className="w-full flex flex-col">{getItems()}</div>
				<Pagination
					className="mx-auto py-2"
					pageIndex={activePage}
					gotoPage={setActivePage}
					length={members?.length || 0}
					pageSize={pageSize}
				/>
			</div>
		);

	return (
		<div className={wrapperClassName + 'w-full'}>
			<Swiper
				className="w-full"
				breakpoints={{
					// when window width is >= 320px
					320: {
						slidesPerView: 1.2,
						spaceBetween: 15,
					},
					580: {
						slidesPerView: 2,
						spaceBetween: 15,
					},
					768: {
						slidesPerView: 3,
						spaceBetween: 20,
					},
					1024: {
						slidesPerView: 4,
						spaceBetween: 10,
					},
					1280: {
						slidesPerView: 5,
						spaceBetween: 5,
					},
				}}
				slides={getItems()}
			/>
		</div>
	);
};
