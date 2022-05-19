import { Button, Card } from '@synthetixio/ui';
import NominateModal from 'components/Modals/Nominate';
import { Text } from 'components/Text/text';
import { TransparentText } from 'components/Text/transparent';
import { useModalContext } from 'containers/Modal';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

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
	period: 'ADMINISTRATION' | 'VOTING' | 'NOMINATION' | 'EVALUATION';
	nomineesCount?: number;
	membersCount?: number;
	image: string;
	council: 'spartan' | 'grants' | 'ambassador' | 'treasury';
}

export default function CouncilCard({
	cta,
	button,
	variant,
	color,
	headlineLeft,
	headlineRight,
	secondButton,
	period = 'ADMINISTRATION',
	nomineesCount,
	membersCount,
	image,
	council,
}: CouncilCardProps) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setContent, setIsOpen } = useModalContext();
	return (
		<Card variant="purple" className="p-1">
			<div className="h-full flex flex-col justify-around align-center darker-60 p-5">
				<Image alt="spartan-council" src={image} width={50} height={72} />
				<h4 className="tg-title-h4 text-center">{t(`landing-page.cards.${council}`)}</h4>
				<span className={`bg-${color} p-1 rounded-md text-center m-4`}>{t(cta)}</span>
				<StyledSpacer />
				<div className="flex justify-around">
					<Text>{t(headlineLeft)}</Text>
					<Text>{t(headlineRight)}</Text>
				</div>
				<div className="flex justify-around">
					<h2 className="tg-title-h2">
						{period === 'NOMINATION' || period === 'VOTING' ? nomineesCount : membersCount}
					</h2>
					{/* TODO @DEV implement votes received or live votes when available */}
					<h2 className="tg-title-h2">{period === 'NOMINATION' ? nomineesCount : membersCount}</h2>
				</div>
				{secondButton && (
					<TransparentText
						gradient="lightBlue"
						onClick={() => {
							push({
								pathname: '/councils/'.concat(council),
								query: {
									nominees: true,
								},
							});
						}}
						clickable
					>
						{t(secondButton)}
					</TransparentText>
				)}
				<Button
					variant={variant}
					className="w-full"
					size="lg"
					onClick={() => {
						if (period === 'NOMINATION') {
							setContent(<NominateModal />);
							setIsOpen(true);
						} else if (period === 'VOTING') {
							push({
								pathname: '/vote/'.concat(council),
							});
						} else {
							push({
								pathname: '/councils',
							});
						}
					}}
				>
					{t(button)}
				</Button>
			</div>
		</Card>
	);
}

const StyledSpacer = styled.span`
	height: 1px;
	width: 203px;
	background: linear-gradient(73.6deg, #8e2de2 2.11%, #4b01e0 90.45%);
`;
