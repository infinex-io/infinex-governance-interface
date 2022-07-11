import MemberCard from 'components/MemberCard/Index';
import { Swiper } from 'components/Swiper';

interface Props {
	members: string[];
	listView: boolean;
	council?: string;
}

export const CouncilCarousel = ({ members, listView, council }: Props) => {
	if (listView)
		return (
			<div className="container w-full flex flex-col">
				{members?.map((member, index) => (
					<MemberCard
						walletAddress={member}
						key={member.concat(String(index))}
						state="ADMINISTRATION"
						className="m-2"
						council={council}
						listView
					/>
				))}
			</div>
		);

	return (
		<div className="w-full container">
			<Swiper
				slideProps={{ className: 'm-2' }}
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
				slides={members.map((member, index) => (
					<MemberCard
						walletAddress={member}
						key={member.concat(String(index))}
						state="ADMINISTRATION"
						council={council}
					/>
				))}
			/>
		</div>
	);
};
