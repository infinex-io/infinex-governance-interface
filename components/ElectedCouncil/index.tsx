import { Button, Card, Flex } from '@synthetixio/ui';
import CouncilsCarousel from 'components/CouncilsCarousel';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function ElectedCouncil() {
	const { t } = useTranslation();

	return (
		<Flex direction="column" alignItems="center">
			<StyledCouncilHeader>{t('landing-pages.nomination.elected-members')}</StyledCouncilHeader>
			<CouncilsCarousel />
			<StyledButton
				text={t('landing-pages.nomination.view-all-members')}
				onClick={() => {}}
				variant="primary"
				size="medium"
			/>
			<StyledCardTimeWrapper>
				<Card withBorderColor={{ color: 'green', withGlow: true }}>Council</Card>
				<Card withBorderColor={{ color: 'green', withGlow: true }}>Council</Card>
				<Card withBorderColor={{ color: 'green', withGlow: true }}>Council</Card>
				<Card withBorderColor={{ color: 'green', withGlow: true }}>Council</Card>
			</StyledCardTimeWrapper>
		</Flex>
	);
}

const StyledCouncilHeader = styled.h1`
	font-family: 'Inter Bold';
	font-size: 3.66rem;
`;

const StyledCardTimeWrapper = styled.div`
	margin-top: 50px;
	display: flex;
	justify-content: space-between;
`;

const StyledButton = styled(Button)`
	margin-top: 50px;
`;
