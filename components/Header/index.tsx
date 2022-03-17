import styled from 'styled-components';
import { theme } from '@synthetixio/ui/dist/esm/styles/';
import SNXIcon from '@synthetixio/ui/dist/esm/components/Icons/SynthetixIcon';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import SpotlightButton from '../SpotlightButton';

export default function Header() {
	// TODO @MF refactor once you got the routes active, fetch information from url
	const [activeIndex, setActiveIndex] = useState(0);
	const { t } = useTranslation('header.routes');

	const routes = [t('home'), t('elections'), t('sips'), t('discuss'), t('vote')];

	return (
		<StyledHeader>
			<SNXIcon />
			<StyledHeaderHeadline>Governance</StyledHeaderHeadline>
			{routes.map((translation, index) => {
				return (
					<StyledSpotlightButton
						text={translation}
						onClick={() => setActiveIndex(index)}
						active={activeIndex === index}
						key={translation}
					/>
				);
			})}
		</StyledHeader>
	);
}

const StyledHeader = styled.header`
	background-color: ${theme.colors.backgroundColor};
	width: 100%;
	min-height: 66px;
	padding-left: ${theme.spacings.margin.biggest};
	display: flex;
	align-items: center;
`;

const StyledHeaderHeadline = styled.h1`
	// TODO @MF check with Darda why different font-family?
	font-family: 'Lustra Text';
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	line-height: 18px;
	color: white;
	margin-left: ${theme.spacings.margin.tiny};
	margin-right: ${theme.spacings.margin.biggest};
`;

const StyledSpotlightButton = styled(SpotlightButton)`
	margin-right: ${theme.spacings.margin.medium};
`;
