import { Button } from '@synthetixio/ui';
import SNXIcon from 'components/Icons/SNXIcon';
import { useRouter } from 'next/router';
import { useCurrentPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const NominateInVotingBanner: React.FC = () => {
	const { push } = useRouter();
	const { t } = useTranslation();
	const periodsData = useCurrentPeriods();

	if (periodsData.find((periodData) => periodData.data?.currentPeriod !== 'VOTING')) return null;

	return (
		<div className="w-full p-0.5 bg-orange rounded mx-auto mt-4">
			<div className="flex md:flex-row flex-col gap-2 items-center justify-between w-full h-full darker-60 p-5">
				<div className="flex md:flex-row flex-col gap-2 items-center">
					<div className="bg-dark-blue rounded-full h-12 w-12 flex items-center justify-center md:mr-4">
						<SNXIcon />
					</div>
					<div className="text-center md:text-left">
						<h3 className="tg-title-h3">{t('landing-page.nominate-banner.title')}</h3>
						<p className="tg-content mt-1">{t('landing-page.nominate-banner.subtitle')}</p>
					</div>
				</div>
				<Button
					onClick={() => {
						push('/nominate');
					}}
					variant="outline"
				>
					{t('landing-page.nominate-banner.cta')}
				</Button>
			</div>
		</div>
	);
};
