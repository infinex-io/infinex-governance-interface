import { Button, Card, Flex } from '@synthetixio/ui';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function Elections() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const councilNames = [
		t('elections.councils.ccc'),
		t('elections.councils.ac'),
		t('elections.councils.sc'),
		t('elections.councils.gc'),
		t('elections.councils.tc'),
	];
	return (
		<Flex direction="column" alignItems="center">
			<StyledElectionsHeadline>{t('elections.headline')}</StyledElectionsHeadline>
			<Flex justifyContent="space-between">
				{councilNames.map((name, index) => (
					<StyledCard withBackgroundColor="darkBlue" key={name.concat(index.toString())}>
						<StyledCardContentWrapper>
							<StyledCouncilCircleOuter>
								<StyledCouncilCircleInner></StyledCouncilCircleInner>
							</StyledCouncilCircleOuter>
							<CouncilCard name={name} />
							<Button
								onClick={() => push({ pathname: '/elections/members/', query: { council: name } })}
								text={t('elections.view-council')}
							></Button>
						</StyledCardContentWrapper>
					</StyledCard>
				))}
			</Flex>
		</Flex>
	);
}

const CouncilCard = ({ name }: { name: string }) => {
	return <StyledCardHeadline>{name}</StyledCardHeadline>;
};

const StyledElectionsHeadline = styled.h1`
	margin: 0;
	text-align: center;
	font-family: 'Inter Bold';
	font-size: 3.33rem;
	margin-bottom: ${({ theme }) => theme.spacings.medium};
`;

const StyledCardHeadline = styled.h4`
	font-family: 'Inter Bold';
	font-size: 1.5rem;
`;

const StyledCard = styled(Card)`
	margin: ${({ theme }) => theme.spacings.medium};
	width: 180px;
	height: 200px;
`;

const StyledCardContentWrapper = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: ${({ theme }) => theme.spacings.tiny};
`;

const StyledCouncilCircleOuter = styled.div`
	border-radius: 50%;
	min-width: 72px;
	min-height: 72px;
	background: ${({ theme }) => theme.colors.gradients.rainbow};
	display: flex;
	justify-content: center;
	align-items: center;
`;

const StyledCouncilCircleInner = styled.div`
	background-color: ${({ theme }) => theme.colors.black};
	width: 70px;
	height: 70px;
	border-radius: 50%;
`;
