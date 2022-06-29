import { Icon } from '@synthetixio/ui';
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
		<div className="w-full max-w-[1080px]">
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
					790: {
						slidesPerView: 3,
						spaceBetween: 20,
					},
					1030: {
						slidesPerView: 4,
						spaceBetween: 10,
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
		</div>
	);
};
