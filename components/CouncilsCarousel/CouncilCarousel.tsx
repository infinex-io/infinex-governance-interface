import MemberCard from 'components/MemberCard/Index';
import { Swiper } from 'components/Swiper';

interface MemberItem {
	address: string;
	council: string;
}

interface Props {
	members: MemberItem[];
	listView: boolean;
}

export const CouncilCarousel = ({ members, listView }: Props) => {
	if (listView)
		return (
			<div className="container w-full flex flex-col">
				{members?.map((member, index) => (
					<MemberCard
						walletAddress={member.address}
						key={member.address.concat(String(index))}
						state="ADMINISTRATION"
						className="m-2"
						council={member.council}
						listView
					/>
				))}
			</div>
		);

	return (
		<Swiper
			breakpoints={{
				// when window width is >= 320px
				320: {
					slidesPerView: 1,
					spaceBetween: 20,
				},
				580: {
					slidesPerView: 2,
					spaceBetween: 25,
				},
				790: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
				1030: {
					slidesPerView: 4,
					spaceBetween: 30,
				},
			}}
			slides={members.map((member, index) => (
				<MemberCard
					walletAddress={member.address}
					key={member.address.concat(String(index))}
					state="ADMINISTRATION"
					className="m-2"
					council={member.council}
				/>
			))}
		/>
	);
};
