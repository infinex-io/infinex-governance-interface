import { Button } from '@synthetixio/ui';
import { H2 } from 'components/Headlines/H2';
import { H4 } from 'components/Headlines/H4';
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
}

export default function CouncilCard({
	cta,
	button,
	variant,
	color,
	headlineLeft,
	headlineRight,
	secondButton,
	period,
	nomineesCount,
	membersCount,
}: CouncilCardProps) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setContent, setIsOpen } = useModalContext();
	return (
		<div className="bg-purple p-1">
			<div className="h-full flex flex-col justify-around align-center darker-60">
				<Image alt="spartan-council" src="/logos/spartan-council.svg" width={50} height={72} />
				<H4>{t('landing-page.cards.sc')}</H4>
				<span className={`bg-${color} p-1`}>{t(cta)}</span>
				<StyledSpacer />
				<div className="flex justify-around">
					<Text>{t(headlineLeft)}</Text>
					<Text>{t(headlineRight)}</Text>
				</div>
				<div className="flex justify-around">
					<H2>{period === 'NOMINATION' || period === 'VOTING' ? nomineesCount : membersCount}</H2>
					{/* TODO @DEV implement votes received or live votes when available */}
					<H2>{period === 'NOMINATION' ? nomineesCount : membersCount}</H2>
				</div>
				{secondButton && (
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
					{t(button)}
				</Button>
			</div>
		</div>
	);
}

const StyledSpacer = styled.span`
	height: 1px;
	width: 203px;
	background: linear-gradient(73.6deg, #8e2de2 2.11%, #4b01e0 90.45%);
`;
