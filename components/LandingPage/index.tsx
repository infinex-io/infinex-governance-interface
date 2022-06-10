import { Button } from '@synthetixio/ui';
import { ArrowLinkOffIcon, ButtonCard } from 'components/old-ui';
import CouncilsCarousel from 'components/CouncilsCarousel';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CouncilCard } from 'components/CouncilCard';
import { COUNCILS_DICTIONARY } from 'constants/config';

export default function LandingPage() {
	const { t } = useTranslation();
	const { push } = useRouter();

	return (
		<div className="flex flex-col p-3 pt-12">
			<h1 className="tg-title-h1 text-center">{t('landing-page.headline')}</h1>
			<span className="tg-content text-gray-500 text-center pt-[8px]">
				{t('landing-page.subline')}
			</span>
			<div className="flex justify-center flex-wrap gap-4 my-8">
				{COUNCILS_DICTIONARY.map((council) => (
					<CouncilCard
						key={council.image}
						image={council.image}
						council={council.slug}
						deployedModule={council.module}
					/>
				))}
			</div>
			<h1 className="tg-title-h1 text-center">{t('landing-page.second-headline')}</h1>
			<span className="tg-content text-gray-500 text-center pt-[8px]">
				{t('landing-page.second-subline')}
			</span>
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
			<h1 className="tg-title-h1 text-center">{t('landing-page.tabs-headline')}</h1>
			<span className="tg-content text-gray-500 text-center pt-[8px]">
				{t('landing-page.tabs-subline')}
			</span>
			<CouncilsCarousel />
			<Button onClick={() => push('/councils')} size="lg" className="m-10 mx-auto">
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
