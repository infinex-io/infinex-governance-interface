import { Button, Flex } from '@synthetixio/ui';
import CouncilsCarousel from 'components/CouncilsCarousel';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function ElectedCouncil() {
	const { t } = useTranslation();
	const { push } = useRouter();
	return (
		<Flex direction="column" alignItems="center">
			<StyledCouncilHeader>{t('landing-pages.nomination.elected-members')}</StyledCouncilHeader>
			<CouncilsCarousel />
			<StyledButton
				onClick={() => {
					push({ pathname: '/elections' });
				}}
				variant="primary"
				size="medium"
			>
				{t('landing-pages.nomination.view-all-members')}
			</StyledButton>
		</Flex>
	);
}

const StyledCouncilHeader = styled.h1`
	font-family: 'Inter Bold';
	font-size: 3.66rem;
`;

const StyledButton = styled(Button)`
	margin: 50px 0px;
	max-width: 120px;
`;
