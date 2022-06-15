import MemberCard from 'components/MemberCard/Index';
import { Carousel } from '@synthetixio/ui';

interface MemberItem {
	address: string;
	council: string;
}

interface Props {
	members: MemberItem[];
	startIndex?: number;
	listView: boolean;
}

export const CouncilCarousel = ({ members, startIndex, listView }: Props) => {
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
	return members.length > 4 ? (
		<>
			<div className="max-w-[912px] lg:block hidden">
				<Carousel
					startPosition={startIndex || 1}
					widthOfItems={300}
					carouselItems={members.map((member, index) => (
						<MemberCard
							walletAddress={member.address}
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
				{members?.map((member, index) => (
					<MemberCard
						walletAddress={member.address}
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
			{members?.map((member, index) => (
				<MemberCard
					walletAddress={member.address}
					key={member.address.concat(String(index))}
					state="ADMINISTRATION"
					className="m-2 max-w-[218px]"
					council={member.council}
				/>
			))}
		</div>
	);
};
