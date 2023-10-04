import { Button, ButtonCard } from '@synthetixio/ui';
import CouncilsCarousel from 'components/CouncilsCarousel';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { CouncilCard } from 'components/CouncilCard';
import { COUNCILS_DICTIONARY, SESSION_STORAGE_KEYS } from 'constants/config';
import { VoteResultBanner } from 'components/VoteResultBanner';
import { NominateInVotingBanner } from 'components/NominateInVotingBanner';
import { TermsModal } from 'components/Modals/TermsModal';
import { useEffect, useState } from 'react';

export default function LandingPage() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const [mounted, setMounted] = useState(false);
	const [terms, setTerms] = useState(false);

	useEffect(() => {
		setMounted(true);
		const TERMS_CONDITIONS_ACCEPTED =
			sessionStorage.getItem(SESSION_STORAGE_KEYS.TERMS_CONDITIONS_ACCEPTED) === 'true';
		setTerms(!TERMS_CONDITIONS_ACCEPTED);
	}, []);

	return (
		<>
			{mounted && <TermsModal defaultOpen={terms} />}
			<div className="flex flex-col p-3 pt-12">
				<h1 className="tg-title-h1 text-center">{t('landing-page.headline')}</h1>
				<span className="tg-content text-gray-500 text-center pt-[8px]">
					{t('landing-page.subline')}
				</span>
				<div className="flex flex-col align-center justify-center">
					<div className="inline-flex mx-auto flex-col align-center justify-center">
						{/*<div className="flex justify-center flex-wrap gap-4 mt-8 mb-4">*/}
						{/*	<CouncilCard*/}
						{/*		key={INFINEX_COUNCIL.image}*/}
						{/*		image={INFINEX_COUNCIL.image}*/}
						{/*		council={INFINEX_COUNCIL.slug}*/}
						{/*		deployedModule={INFINEX_COUNCIL.module}*/}
						{/*	/>*/}
						{/*</div>*/}
						<div className="flex justify-center flex-wrap gap-4 mt-8 mb-4">
							{COUNCILS_DICTIONARY.map((council) => (
								<CouncilCard
									key={council.image}
									image={council.image}
									council={council.slug}
									deployedModule={council.module}
								/>
							))}
						</div>
						<VoteResultBanner />
						<NominateInVotingBanner />
					</div>
				</div>
				<h1 className="tg-title-h1 text-center pt-8">{t('landing-page.second-headline')}</h1>
				<span className="tg-content text-gray-500 text-center pt-[8px]">
					{t('landing-page.second-subline')}
				</span>
				<div className="flex flex-wrap justify-center mt-8">
					<Link href="/councils" passHref legacyBehavior>
						<ButtonCard
							className="max-w-lg m-2 h-[170px] md:h-[122px]"
							headline={t('landing-page.button-cards.all-members')}
							subline={t('landing-page.button-cards.all-members-subline')}
							direction="left"
						></ButtonCard>
					</Link>
					<Link href="https://sips.synthetix.io/all-sip/" passHref legacyBehavior>
						<ButtonCard
							className="max-w-lg m-2 h-[170px] md:h-[122px]"
							headline={t('landing-page.button-cards.sccp')}
							subline={t('landing-page.button-cards.sccp-subline')}
							direction="left"
						></ButtonCard>
					</Link>
				</div>
				<div className="flex flex-wrap justify-center">
					<Link href="https://discord.com/invite/HQSTqXH84t" passHref legacyBehavior>
						<ButtonCard
							className="max-w-lg m-2 h-[170px] md:h-[122px]"
							headline={t('landing-page.button-cards.forum')}
							subline={t('landing-page.button-cards.forum-subline')}
							direction="left"
						></ButtonCard>
					</Link>
					<Link href="https://gov.synthetix.io/#/" passHref legacyBehavior>
						<ButtonCard
							className="max-w-lg m-2 h-[170px] md:h-[122px]"
							headline={t('landing-page.button-cards.records')}
							subline={t('landing-page.button-cards.records-subline')}
							direction="left"
						></ButtonCard>
					</Link>
				</div>
				<h1 className="tg-title-h1 text-center pt-8">{t('landing-page.tabs-headline')}</h1>
				<span className="tg-content text-gray-500 text-center pt-[8px]">
					{t('landing-page.tabs-subline')}
				</span>
				<CouncilsCarousel onlyAllMembers />
				<Button onClick={() => push('/councils')} size="lg" className="m-10 mx-auto">
					{t('landing-page.carousel-btn')}
				</Button>
			</div>
		</>
	);
}
