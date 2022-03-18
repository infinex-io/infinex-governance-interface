import ExternalLink from '@synthetixio/ui/dist/esm/components/ExternalLink';
import SNXIcon from '@synthetixio/ui/dist/esm/components/Icons/SNXIcon';
import { theme } from '@synthetixio/ui/dist/esm/styles';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const LINKS = [
	{
		title: 'SNX',
		link: '',
	},
	{
		title: 'SYNTHS',
		link: '',
	},
	{
		title: 'STATS',
		link: '',
	},
	{
		title: 'STAKING',
		link: '',
	},
	{
		title: 'BUILD',
		link: '',
	},
	{
		title: 'COMMUNITY',
		link: '',
	},
	{
		title: 'CAREERS',
		link: '',
	},
	{
		title: 'BLOG',
		link: '',
	},
	{
		title: 'RESEARCH',
		link: '',
	},
];

export default function Footer() {
	const { t } = useTranslation();
	return (
		<StyledFooter>
			<StyledSNXIcon />
			<StyledCopyRightText>{t('footer.copyright')}</StyledCopyRightText>
			{LINKS.map((link) => {
				return (
					<StyledLinks
						key={link.title}
						link={link.link}
						text={link.title}
						customColor={{ textColor: 'white', hoverColor: 'grey' }}
						withoutIcon={true}
					/>
				);
			})}
		</StyledFooter>
	);
}

const StyledFooter = styled.footer`
	background-color: ${theme.colors.backgroundColor};
	width: 100%;
	height: 150px;
	display: flex;
	align-items: center;
	padding: ${theme.spacings.margin.biggest};
`;

const StyledSNXIcon = styled(SNXIcon)`
	width: 42px;
	height: 30px;
`;

const StyledCopyRightText = styled.span`
	font-family: 'Inter';
	font-style: normal;
	font-weight: 400;
	font-size: 1.16rem;
	color: white;
	opacity: 0.7;
	margin-left: ${theme.spacings.margin.biggest};
	margin-right: auto;
`;

const StyledLinks = styled(ExternalLink)`
	font-family: 'GT America';
	font-style: normal;
	font-weight: 700;
	font-size: 1.16rem;
	text-transform: uppercase;
	margin-right: ${theme.spacings.margin.medium};
`;
