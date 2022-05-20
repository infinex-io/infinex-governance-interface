import { Button } from '@synthetixio/ui';
import { ArrowLinkOffIcon, ButtonCard } from 'components/old-ui';
import CouncilsCarousel from 'components/CouncilsCarousel';
import { H1 } from 'components/Headlines/H1';
import { Text } from 'components/Text/text';
import { DeployedModules } from 'containers/Modules';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CouncilCard } from 'components/CouncilCard';

export default function LandingPage() {
	const { t } = useTranslation();
	const { push } = useRouter();

	return (
		<div className="flex flex-col align-center gap-4">
			<H1>{t('landing-page.headline')}</H1>
			<Text>{t('landing-page.subline')}</Text>
			<div className="flex justify-center flex-wrap gap-4 my-8">
				<CouncilCard
					image="/logos/spartan-council.svg"
					deployedModule={DeployedModules.SPARTAN_COUNCIL}
					council="spartan"
				/>
				<CouncilCard
					image="/logos/grants-council.svg"
					deployedModule={DeployedModules.GRANTS_COUNCIL}
					council="grants"
				/>
				<CouncilCard
					image="/logos/ambassador-council.svg"
					deployedModule={DeployedModules.AMBASSADOR_COUNCIL}
					council="ambassador"
				/>
				<CouncilCard
					image="/logos/treasury-council.svg"
					deployedModule={DeployedModules.TREASURY_COUNCIL}
					council="treasury"
				/>
			</div>
			<H1>{t('landing-page.second-headline')}</H1>
			<Text>{t('landing-page.second-subline')}</Text>
			<div className="flex flex-wrap justify-center mt-8">
				<Link href="/councils" passHref>
					<StyledButtonCards
						headline={t('landing-page.button-cards.all-members')}
						subline={t('landing-page.button-cards.all-members-subline')}
						icon={<ArrowLinkOffIcon active />}
						arrowDirection="right"
					></StyledButtonCards>
				</Link>
				<Link href="https://sips.synthetix.io/all-sip/" passHref>
					<StyledButtonCards
						headline={t('landing-page.button-cards.sccp')}
						subline={t('landing-page.button-cards.sccp-subline')}
						icon={<ArrowLinkOffIcon active />}
						arrowDirection="right"
					></StyledButtonCards>
				</Link>
			</div>
			<div className="flex flex-wrap justify-center">
				<Link href="https://discord.com/invite/HQSTqXH84t" passHref>
					<StyledButtonCards
						headline={t('landing-page.button-cards.forum')}
						subline={t('landing-page.button-cards.forum-subline')}
						icon={<ArrowLinkOffIcon active />}
						arrowDirection="right"
					></StyledButtonCards>
				</Link>
				<Link href="https://gov.synthetix.io/#/" passHref>
					<StyledButtonCards
						headline={t('landing-page.button-cards.records')}
						subline={t('landing-page.button-cards.records-subline')}
						icon={<ArrowLinkOffIcon active />}
						arrowDirection="right"
					></StyledButtonCards>
				</Link>
			</div>
			<H1>{t('landing-page.tabs-headline')}</H1>
			<Text>{t('landing-page.tabs-subline')}</Text>
			<CouncilsCarousel />
			<Button
				onClick={() => {
					push({ pathname: '/councils' });
				}}
				size="md"
				className="mx-auto my-10 min-w-[140px]"
			>
				{t('landing-page.carousel-btn')}
			</Button>
		</div>
	);
}

const StyledButtonCards = styled(ButtonCard)`
	width: 350px;
	height: 112px;
	margin: ${({ theme }) => theme.spacings.small};
`;
