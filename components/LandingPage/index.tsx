import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { CouncilCard } from 'components/CouncilCard';
import { COUNCILS_DICTIONARY, SESSION_STORAGE_KEYS } from 'constants/config';
import { VoteResultBanner } from 'components/VoteResultBanner';
import { NominateInVotingBanner } from 'components/NominateInVotingBanner';

export default function LandingPage() {
	const { t } = useTranslation();

	return (
		<>
			<div className="flex flex-col p-3 pt-12">
				<h1 className="tg-title-h1 text-center">{t('landing-page.headline')}</h1>
				<span className="tg-content text-gray-500 text-center pt-[8px]">
					{t('landing-page.subline')}
				</span>
				<div className="flex flex-col align-center justify-center">
					<div className="inline-flex mx-auto flex-col align-center justify-center">
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
						{/* <NominateInVotingBanner /> */}
					</div>
				</div>
			</div>
		</>
	);
}
