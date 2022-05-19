import { H4 } from 'components/Headlines/H4';
import Image from 'next/image';

interface CouncilCardProps {
	cta: string;
	button: string;
	variant: 'default' | 'outline';
	color:
		| 'backgroundColor'
		| 'black'
		| 'white'
		| 'grey'
		| 'disabled'
		| 'orange'
		| 'lightBlue'
		| 'purple'
		| 'pink'
		| 'green';
	headlineLeft: string;
	headlineRight: string;
	secondButton?: string | undefined;
}

export default function CouncilCard({cta, button, variant, color, headlineLeft, headlineRight, secondButton}: CouncilCardProps) {
	return (
		<div className="bg-purple p-1">
			<div className="h-full flex flex-col justify-around align-center darker-60">
				<Image alt="spartan-council" src="/logos/spartan-council.svg" width={50} height={72} />
				<H4>{t('landing-page.cards.sc')}</H4>
						<StyledCTALabel color={spartanCouncilInfo.color}>
							{t(spartanCouncilInfo.cta)}
						</StyledCTALabel>
						<StyledSpacer />
						<div className="flex justify-around">
							<Text>{t(spartanCouncilInfo.headlineLeft)}</Text>
							<Text>{t(spartanCouncilInfo.headlineRight)}</Text>
						</div>
						<div className="flex justify-around">
							<H2>
								{spartanCurrentPeriod.currentPeriod === 'NOMINATION' ||
								spartanCurrentPeriod.currentPeriod === 'VOTING'
									? spartanNominees.data?.length
									: spartanMembers.data?.length}
							</H2>
							{/* TODO @DEV implement votes received or live votes when available */}
							<H2>
								{spartanCurrentPeriod.currentPeriod === 'NOMINATION'
									? spartanNominees.data?.length
									: spartanMembers.data?.length}
							</H2>
						</div>
							<TransparentText
								gradient="lightBlue"
								onClick={() => {
									push({
										pathname: '/councils',
										query: {
											council: 'spartan',
											nominees: true,
										},
									});
								}}
								clickable
							>
								{t(spartanCouncilInfo.secondButton)}
							</TransparentText>
						<Button
							variant={spartanCouncilInfo.variant}
							className="w-full"
							size="lg"
							// variant={spartanCouncilInfo.variant}
							onClick={() => {
								if (spartanCurrentPeriod.currentPeriod === 'NOMINATION') {
									setContent(<NominateModal />);
									setIsOpen(true);
								} else if (spartanCurrentPeriod.currentPeriod === 'VOTING') {
									push({
										pathname: '/vote',
										query: {
											council: 'spartan',
										},
									});
								} else {
									push({
										pathname: '/councils',
										query: {
											council: 'spartan',
										},
									});
								}
							}}
						>
							{t(spartanCouncilInfo.button)}
						</Button>
					</>
			</div>
		</div>
	);
}
