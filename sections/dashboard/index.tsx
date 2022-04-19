import { Carousel } from '@synthetixio/ui';
import useEpochIndexQuery from 'queries/useEpochIndexQuery';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function Dashboard() {
	const { t } = useTranslation();

	const epochIndex = useEpochIndexQuery();

	return (
		<StyledDashboard>
			<StyledHeadline>{t('dashboard.headline')}</StyledHeadline>

			<StyledHeadline>Current EPOCH: {epochIndex.data}</StyledHeadline>

			<StyledSubline>
				{/* TODO @DEV */}
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consectetur sit donec id etiam id
				morbi viverra.
			</StyledSubline>
			<Carousel carouselItems={carouselItems} maxWidth="100%"></Carousel>
		</StyledDashboard>
	);
}

const StyledDashboard = styled.section`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const StyledHeadline = styled.h1`
	font-family: 'Inter';
	font-style: normal;
	font-weight: 700;
	font-size: 40px;
`;

const StyledSubline = styled.span``;

const StyledCarouselItem = styled.div`
	min-width: 600px;
	height: 500px;
	display: flex;
	justify-content: center;
`;

const carouselItems = [
	<StyledCarouselItem>1</StyledCarouselItem>,
	<StyledCarouselItem>2</StyledCarouselItem>,
	<StyledCarouselItem>3</StyledCarouselItem>,
	<StyledCarouselItem>4</StyledCarouselItem>,
	<StyledCarouselItem>5</StyledCarouselItem>,
	<StyledCarouselItem>6</StyledCarouselItem>,
];
