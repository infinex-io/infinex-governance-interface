import styled from 'styled-components';
import { theme } from '@synthetixio/ui/dist/esm/styles/';
import IconButton from '@synthetixio/ui/dist/esm/components/IconButton';
import SettingsIcon from '@synthetixio/ui/dist/esm/components/Icons/SettingsIcon';
import SNXIcon from '@synthetixio/ui/dist/esm/components/Icons/SNXIcon';
import { useTranslation } from 'react-i18next';
import SpotlightButton from '../SpotlightButton';
import { useRouter } from 'next/router';
import Button from '@synthetixio/ui/dist/esm/components/Button';

export default function Header() {
	const { push, route } = useRouter();
	const { t } = useTranslation();

	const routes = [
		t('header.routes.home'),
		t('header.routes.elections'),
		t('header.routes.sips'),
		t('header.routes.discuss'),
		t('header.routes.vote'),
	];

	const handleIndexAndRouteChange = (index: number) => {
		push(index === 0 ? '' : routes[index].toLowerCase());
	};

	const isActiveRoute = (index: number) => {
		if (!index) return true;
		const splitRoute = route.split('/');
		return routes[index].toLowerCase() === splitRoute[0].toLowerCase();
	};
	return (
		<StyledHeader>
			<SNXIcon />
			<StyledHeaderHeadline>Governance</StyledHeaderHeadline>
			{routes.map((translation, index) => {
				const isActive = isActiveRoute(index);
				return (
					<StyledSpotlightButton
						text={translation}
						onClick={() => handleIndexAndRouteChange(index)}
						active={isActive}
						key={translation}
					/>
				);
			})}
			<ButtonContainer>
				<IconButton icon={<SettingsIcon />} size="tiny" active={true} />
				<Button
					text={t('header.connect-wallet')}
					variant="secondary"
					secondaryBackgroundColor={theme.colors.backgroundColor}
				/>
			</ButtonContainer>
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
	border-bottom: 1px solid rgba(130, 130, 149, 0.3);
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
	:last-of-type {
		margin-right: auto;
	}
`;

const ButtonContainer = styled.div`
	display: flex;
	justify-content: space-between;
	min-width: 200px;
	margin-right: ${theme.spacings.margin.superBig};
`;
